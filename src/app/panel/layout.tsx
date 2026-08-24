import UserPanelLayout from "@/components/userPanelLayout";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return <UserPanelLayout>{children}</UserPanelLayout>;
}
