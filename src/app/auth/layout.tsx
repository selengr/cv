import GuestLayout from "@/components/guestLayout";
import Logo from "@/components/landing/logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GuestLayout>
      <div className="flex min-h-screen flex-col bg-[#f4efe6]">
        <div className="px-5 py-5 sm:px-8">
          <Logo />
        </div>
        <div className="flex flex-1 items-start justify-center px-5 pb-16 sm:items-center">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </GuestLayout>
  );
}
