import GuestLayout from "@/components/guestLayout";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <GuestLayout>{children}</GuestLayout>;
}
