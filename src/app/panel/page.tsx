import UserInfo from "@/components/panel/userInfo";

export default function PanelPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">پنل کاربری</h1>
      <UserInfo />
    </div>
  );
}
