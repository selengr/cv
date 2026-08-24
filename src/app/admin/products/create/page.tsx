import CreateProductForm from "@/forms/admin/product/createProductForm";

export default function ProductCreatePage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">ایجاد محصولات</h1>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden bg-white shadow ring-1 ring-black/5 md:rounded-lg">
              <CreateProductForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
