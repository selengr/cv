import RegisterForm from "@/forms/auth/registerForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-center text-3xl font-bold tracking-tight text-[#14110e]">
        ثبت‌نام
      </h1>
      <p className="mt-2 text-center text-sm text-[#6b6459]">
        اسم و شماره موبایل کافی است
      </p>
      <div className="mt-8 rounded-3xl border border-[#14110e]/8 bg-white/80 px-5 py-8 shadow-sm sm:px-8">
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-[#6b6459]">
          قبلا حساب ساختی؟{" "}
          <Link href="/auth/login" className="font-medium text-[#1f4a45]">
            ورود
          </Link>
        </p>
      </div>
    </>
  );
}
