import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminPanel from "@/components/admin/AdminPanel";
import { Package } from "lucide-react";

export default function AdminProductsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Product Library"
        description="Inventory editing is still intentionally light, but the route now matches the storefront system."
      />

      <AdminPanel className="p-6 sm:p-8">
        <AdminEmptyState
          title="Product Controls"
          description="The management table for editing and archiving products will be added here in the same glass language."
          icon={Package}
        />
      </AdminPanel>
    </div>
  );
}
