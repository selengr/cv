"use client";

import { Form, type FormikProps } from "formik";
import { useRouter } from "next/navigation";
import { CreateProductInterface } from "@/contracts/admin/products";
import Input from "@/components/shared/form/input";
import SelectBox from "@/components/shared/form/selectbox";
import Textarea from "@/components/shared/form/textarea";
import Product from "@/models/product";

type ProductFormProps = FormikProps<CreateProductInterface> & {
  product?: Product;
};

export default function InnerProductForm(props: ProductFormProps) {
  const router = useRouter();

  return (
    <Form>
      <div className="grid grid-cols-1 gap-y-6 p-6 sm:grid-cols-4 sm:gap-x-8">
        <div className="sm:col-span-2">
          <Input name="title" type="text" label="نام محصول" />
        </div>
        <div className="sm:col-span-2">
          <SelectBox
            name="category_id"
            label="دسته بندی"
            options={[
              { label: "لطفا یکی از دسته بندی ها را انتخاب کنید", value: "" },
              { label: "جاوااسکریپت", value: 1 },
              { label: "php", value: 2 },
            ]}
          />
        </div>
        <div className="sm:col-span-2">
          <Input name="price" type="number" label="قیمت محصول" />
        </div>
        <div className="sm:col-span-4">
          <Textarea
            name="description"
            label="درباره محصول"
            onChange={(e) => props.setFieldValue("description", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center border-t border-gray-200 bg-gray-50 p-6 py-4">
        <button
          type="submit"
          className="ml-2 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm leading-4 font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        >
          {props.product ? "ثبت تغییرات" : "ایجاد محصول"}
        </button>
        <button
          onClick={() => router.push("/admin/products")}
          type="button"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm leading-4 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
        >
          انصراف
        </button>
      </div>
    </Form>
  );
}
