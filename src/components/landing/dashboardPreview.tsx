const products = [
  { id: "1042", title: "کفش اسپرت سفید", price: "۱٬۲۸۰٬۰۰۰" },
  { id: "1041", title: "کیف چرم دستی", price: "۲٬۴۵۰٬۰۰۰" },
  { id: "1040", title: "تیشرت نخی", price: "۳۲۰٬۰۰۰" },
];

export default function DashboardPreview() {
  return (
    <div className="landing-preview relative w-full overflow-hidden rounded-3xl border border-white/10 bg-[#14110e] shadow-[0_40px_80px_-32px_rgba(20,17,14,0.55)]">
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#c45c3e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#c9a227]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#3d8b7a]" />
        <span className="mr-3 text-xs text-white/40">admin.shopy</span>
      </div>

      <div className="grid min-h-[340px] grid-cols-[4.5rem_1fr] sm:grid-cols-[11rem_1fr]">
        <aside className="border-l border-white/8 bg-[#1a2422] p-3 sm:p-4">
          <p className="hidden px-2 text-[11px] text-white/35 sm:block">منو</p>
          <div className="mt-3 space-y-1.5">
            {["داشبورد", "محصولات", "کاربران"].map((item, index) => (
              <div
                key={item}
                className={`rounded-lg px-2 py-2 text-xs sm:px-3 sm:text-sm ${
                  index === 1 ? "bg-white/10 text-white" : "text-white/50"
                }`}
              >
                <span className="hidden sm:inline">{item}</span>
                <span className="mx-auto block h-1.5 w-6 rounded-full bg-current sm:hidden" />
              </div>
            ))}
          </div>
        </aside>

        <div className="bg-[#f7f3ec] p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#6b6459]">کاتالوگ</p>
              <h3 className="text-base font-semibold text-[#14110e] sm:text-lg">
                لیست محصولات
              </h3>
            </div>
            <span className="rounded-full bg-[#1f4a45] px-3 py-1.5 text-xs text-white">
              محصول جدید
            </span>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {[
              { label: "موجود", value: "۲۴" },
              { label: "امروز", value: "۸" },
              { label: "نقش‌ها", value: "۳" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl bg-white px-3 py-2.5 shadow-sm"
              >
                <p className="text-[11px] text-[#6b6459]">{stat.label}</p>
                <p className="text-lg font-semibold text-[#14110e]">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
            {products.map((product, index) => (
              <div
                key={product.id}
                className={`flex items-center justify-between px-4 py-3 text-sm ${
                  index !== products.length - 1 ? "border-b border-[#efe8dc]" : ""
                }`}
              >
                <div>
                  <p className="font-medium text-[#14110e]">{product.title}</p>
                  <p className="text-xs text-[#6b6459]">#{product.id}</p>
                </div>
                <p className="text-[#1f4a45]">{product.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
