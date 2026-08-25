"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

export default function PhoneDemo() {
  const [step, setStep] = useState<"phone" | "code" | "done">("phone");
  const [phone, setPhone] = useState("0912");
  const [code, setCode] = useState("");

  const sendCode = () => {
    if (phone.replace(/\D/g, "").length < 11) return;
    setStep("code");
  };

  const verify = () => {
    if (code.length < 6) return;
    setStep("done");
  };

  return (
    <div className="rounded-[1.75rem] border border-[#14110e]/8 bg-white/80 p-5 shadow-[0_20px_50px_-28px_rgba(20,17,14,0.4)] sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs tracking-wide text-[#6b6459]">ورود آزمایشی</p>
        <span className="h-2 w-2 rounded-full bg-[#3d8b7a]" />
      </div>

      <AnimatePresence mode="wait">
        {step === "phone" && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <p className="font-display text-lg font-semibold">شماره موبایل</p>
            <p className="mt-1 text-sm text-[#6b6459]">این فقط یک نمایش است. پیامکی نمی‌رود.</p>
            <input
              dir="ltr"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-4 w-full rounded-2xl border border-[#14110e]/10 bg-[#f4efe6] px-4 py-3 text-left tracking-wide outline-none focus:border-[#1f4a45]"
              placeholder="09121234567"
            />
            <button
              type="button"
              onClick={sendCode}
              className="mt-3 w-full rounded-full bg-[#1f4a45] py-2.5 text-sm text-white transition hover:bg-[#173833]"
            >
              گرفتن کد
            </button>
          </motion.div>
        )}

        {step === "code" && (
          <motion.div
            key="code"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <p className="font-display text-lg font-semibold">کد شش رقمی</p>
            <p className="mt-1 text-sm text-[#6b6459]">هر ۶ رقمی بزن تا ببینی بعدش چه شکلی است.</p>
            <input
              dir="ltr"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="mt-4 w-full rounded-2xl border border-[#14110e]/10 bg-[#f4efe6] px-4 py-3 text-center text-lg tracking-[0.4em] outline-none focus:border-[#1f4a45]"
              placeholder="------"
            />
            <button
              type="button"
              onClick={verify}
              className="mt-3 w-full rounded-full bg-[#1f4a45] py-2.5 text-sm text-white transition hover:bg-[#173833]"
            >
              ورود به پنل
            </button>
            <button
              type="button"
              onClick={() => setStep("phone")}
              className="mt-2 w-full text-xs text-[#6b6459]"
            >
              تغییر شماره
            </button>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-2"
          >
            <p className="font-display text-lg font-semibold">دیدی؟ همین‌قدر کوتاه است</p>
            <p className="mt-2 text-sm leading-7 text-[#5c564d]">
              بعد از کد، می‌روی داخل پنل. محصول اضافه می‌کنی و کار تمام است.
            </p>
            <Link
              href="/auth/register"
              className="mt-4 inline-flex rounded-full bg-[#1f4a45] px-5 py-2.5 text-sm text-white"
            >
              حساب واقعی بساز
            </Link>
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setCode("");
              }}
              className="mt-3 block text-xs text-[#6b6459]"
            >
              دوباره از اول
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
