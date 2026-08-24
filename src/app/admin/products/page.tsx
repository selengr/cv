"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import EmptyList from "@/components/shared/emptyList";
import LoadingBox from "@/components/shared/loadingBox";
import ReactCustomPaginate from "@/components/shared/reactCustomPaginate";
import ProductListItem from "@/components/admin/products/productListItem";
import { GetProducts } from "@/services/product";
import { useAppSelector } from "@/hooks";
import { selectUser } from "@/store/auth";
import Product from "@/models/product";

function ProductListPage() {
  const user = useAppSelector(selectUser);
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1) || 1;
  const { data, error, mutate } = useSWR(
    { url: "/admin/products", page },
    GetProducts,
  );
  const loadingProducts = !data && !error;

  const onPageChangeHandler = ({ selected }: { selected: number }) =>
    router.push(`/admin/products?page=${selected + 1}`);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">لیست محصولات</h1>
          <p className="mt-2 text-sm text-gray-700">
            در این صفحه لیست محصولات وبسایت به شما نمایش داده می‌شود
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:mr-16 sm:flex-none">
          {user.canAccess("add_new_product") && (
            <Link
              href="/admin/products/create"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none sm:w-auto"
            >
              اضافه کردن محصول
            </Link>
          )}
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black/5 md:rounded-lg">
              {loadingProducts ? (
                <div className="p-5">
                  <LoadingBox />
                </div>
              ) : data?.products?.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pr-3 pl-4 text-right text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        شماره محصول
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                      >
                        عنوان
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pr-4 pl-3 sm:pr-6"
                      />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {data?.products.map((product: Product) => (
                      <ProductListItem
                        key={product.id}
                        product={product}
                        mutateProducts={mutate}
                      />
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-5">
                  <EmptyList
                    title="محصولی برای نمایش وجود ندارد"
                    description="در حال حاضر محصول وجود ندارد می‌توانید یک محصول اضافه کنید"
                  />
                </div>
              )}

              {data?.total_page > 1 && (
                <div className="mt-2 border-t border-gray-200 p-4">
                  <ReactCustomPaginate
                    onPageChangeHandler={onPageChangeHandler}
                    pageCount={data?.total_page}
                    page={page}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductListPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="p-5">
          <LoadingBox />
        </div>
      }
    >
      <ProductListPage />
    </Suspense>
  );
}
