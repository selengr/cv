"use client";

import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import EditProductForm from "@/forms/admin/product/editProductForm";
import ValidationError from "@/exceptions/validationError";
import { GetSingleProduct } from "@/services/product";

export default function ProductEditPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = use(params);
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    { url: `/admin/products/${productId}/edit`, productId: Number(productId) },
    GetSingleProduct,
  );

  useEffect(() => {
    if (error instanceof ValidationError) {
      router.replace("/admin/products");
    }
  }, [error, router]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">ویرایش محصول</h1>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden bg-white shadow ring-1 ring-black/5 md:rounded-lg">
              {isLoading ? (
                <span className="block p-6">Loading ...</span>
              ) : (
                data?.product && <EditProductForm product={data.product} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
