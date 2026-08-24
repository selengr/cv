import AdminPanelLayout from "@/components/adminPanelLayout";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
