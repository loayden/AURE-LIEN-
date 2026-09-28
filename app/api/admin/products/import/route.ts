import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest } from "@/lib/auth";
import { getClientIpFromHeaders, logAdminAction } from "@/lib/adminAudit";
import { upsertProductJson, type ProductRecord } from "@/lib/productsJson";
import {
  buildProductRecord,
  validateProductRecord,
  writeProductToMongo,
} from "@/app/api/admin/products/route";

const NO_STORE = { "Cache-Control": "no-store, max-age=0" };
const MAX_ROWS = 500;

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      cells.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current.trim());
  return cells;
}

// Columns: name,category,price,stock,images(| separated),size(|),colors(|),description,material,discount
const COLUMNS = ["name", "category", "price", "stock", "images", "size", "colors", "description", "material", "discount"];

/**
 * Bulk product import. POST { csv, dryRun? }.
 * dryRun=true validates + previews without writing anything.
 */
export async function POST(req: NextRequest) {
  const auth = await getAuthFromRequest(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ message: "Not authorized" }, { status: 403, headers: NO_STORE });
  }
  try {
    const body = await req.json().catch(() => ({}));
    const csv = String(body.csv ?? "");
    const isDryRun = body.dryRun === undefined ? true : Boolean(body.dryRun);
    if (!csv.trim()) {
      return NextResponse.json({ error: "csv required" }, { status: 400, headers: NO_STORE });
    }
    const lines = csv.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).slice(0, MAX_ROWS + 1);
    const header = splitCsvLine(lines[0]).map((h) => h.toLowerCase());
    const hasHeader = header.includes("name") && header.includes("price");
    const dataLines = hasHeader ? lines.slice(1) : lines;
    if (dataLines.length > MAX_ROWS) {
      return NextResponse.json({ error: `Max ${MAX_ROWS} rows` }, { status: 400, headers: NO_STORE });
    }

    const valid: ProductRecord[] = [];
    const errors: Array<{ row: number; error: string }> = [];
    dataLines.forEach((line, i) => {
      const cells = splitCsvLine(line);
      const get = (name: string): string => {
        if (hasHeader) {
          const idx = header.indexOf(name);
          return idx === -1 ? "" : (cells[idx] ?? "");
        }
        const idx = COLUMNS.indexOf(name);
        return cells[idx] ?? "";
      };
      const record = buildProductRecord({
        _id: `p-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}`,
        name: get("name"),
        category: get("category"),
        price: get("price"),
        stock: get("stock"),
        images: get("images").replace(/\|/g, ","),
        size: get("size").replace(/\|/g, ","),
        colors: get("colors").replace(/\|/g, ","),
        description: get("description"),
        material: get("material"),
        discount: get("discount"),
      });
      const problem = validateProductRecord(record);
      if (problem) {
        errors.push({ row: i + (hasHeader ? 2 : 1), error: problem });
      } else {
        valid.push(record);
      }
    });

    if (isDryRun) {
      return NextResponse.json(
        { dryRun: true, valid: valid.length, errors, preview: valid.slice(0, 5) },
        { headers: NO_STORE }
      );
    }

    let saved = 0;
    for (const record of valid) {
      try {
        await writeProductToMongo(record);
        await upsertProductJson(record);
        saved++;
      } catch {
        errors.push({ row: -1, error: `Failed to save ${record.name}` });
      }
    }
    await logAdminAction({
      action: "admin.product.import",
      actorId: auth.userId,
      actorEmail: auth.email,
      targetType: "product",
      detail: { saved, errors: errors.length },
      ip: getClientIpFromHeaders(req.headers),
    });
    return NextResponse.json({ success: true, saved, errors }, { headers: NO_STORE });
  } catch (error) {
    console.error("Product import error:", error instanceof Error ? error.message : String(error));
    return NextResponse.json({ error: "Import failed" }, { status: 500, headers: NO_STORE });
  }
}
