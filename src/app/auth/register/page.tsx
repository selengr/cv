import RegisterForm from "@/forms/auth/registerForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          ثبت‌نام در Shopy
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-gray-600">
            قبلا ثبت‌نام کرده‌اید؟{" "}
            <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              ورود
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
