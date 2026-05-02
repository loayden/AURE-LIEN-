import type { Metadata } from "next";
import { getProductById } from "@/lib/getAllProducts";
import ProductPageClient from "./ProductPageClient";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_URL || "https://maisonaurelia.com").replace(/\/$/, "");
}

function toAbsoluteUrl(path: string | undefined): string | undefined {
  if (!path) return undefined;
  try {
    return new URL(path, getBaseUrl()).toString();
  } catch {
    return undefined;
  }
}

async function getProductFromParams(params: ProductPageProps["params"]) {
  const { id } = await params;
  return getProductById(decodeURIComponent(id));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductFromParams(params);

  if (!product) {
    return {
      title: "Product Not Found | BOUT",
      description: "This BOUT product is no longer available.",
    };
  }

  const canonical = `${getBaseUrl()}/product/${encodeURIComponent(product._id)}`;
  const image = toAbsoluteUrl(product.images?.[0]);
  const title = `${product.name} | BOUT`;
  const description =
    product.description ||
    `${product.name} from the BOUT catalogue, available in EGP pricing.`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: "website",
      url: canonical,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductFromParams(params);
  const baseUrl = getBaseUrl();

  const productJsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description || product.name,
        image: product.images?.map((image) => toAbsoluteUrl(image)).filter(Boolean),
        sku: product._id,
        brand: {
          "@type": "Brand",
          name: "BOUT",
        },
        offers: {
          "@type": "Offer",
          url: `${baseUrl}/product/${encodeURIComponent(product._id)}`,
          priceCurrency: "EGP",
          price: product.price,
          availability:
            product.stock === 0
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
        },
      }
    : null;

  return (
    <>
      {productJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
        />
      )}
      <ProductPageClient />
    </>
  );
}
