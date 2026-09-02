"use client";

import { Form, type FormikProps } from "formik";
import { useRouter } from "next/navigation";
import { CreateProductInterface } from "@/contracts/admin/products";
import Input from "@/components/shared/form/input";
import SelectBox from "@/components/shared/form/selectbox";
import Textarea from "@/components/shared/form/textarea";
import { PRODUCT_EMOJIS, categorySelectOptions } from "@/helpers/catalog";
import ProductImageField from "@/components/admin/products/productImageField";
import ProductVariantsField from "@/components/admin/products/productVariantsField";
import Product from "@/models/product";

type ProductFormProps = FormikProps<CreateProductInterface> & {
  product?: Product;
};

export default function InnerProductForm(props: ProductFormProps) {
  const router = useRouter();
  const hasVariantRows = (props.values.variants?.length ?? 0) > 0;

  return (
    <Form>
      <div className="grid grid-cols-1 gap-y-6 p-6 sm:grid-cols-4 sm:gap-x-8">
        <div className="sm:col-span-2">
          <Input name="title" type="text" label="نام محصول (فارسی)" />
        </div>
        <div className="sm:col-span-2">
          <Input name="title_en" type="text" label="Title (English)" />
        </div>
        <div className="sm:col-span-2">
          <SelectBox
            name="category_id"
            label="دسته‌بندی"
            options={categorySelectOptions}
          />
        </div>
        <div className="sm:col-span-2">
          <Input name="price" type="number" label="قیمت (تومان)" />
        </div>
        <div className="sm:col-span-1">
          <Input
            name="stock"
            type="number"
            label={hasVariantRows ? "موجودی (جمع گزینه‌ها)" : "موجودی"}
          />
        </div>
        <div className="sm:col-span-1">
          <SelectBox
            name="emoji"
            label="شکلک"
            options={PRODUCT_EMOJIS.map((emoji) => ({
              label: emoji,
              value: emoji,
            }))}
          />
        </div>
        <div className="sm:col-span-4">
          <ProductImageField
            value={props.values.image}
            onChange={(value) => props.setFieldValue("image", value)}
          />
        </div>
        <ProductVariantsField
          value={props.values.variants ?? []}
          onChange={(next) => {
            props.setFieldValue("variants", next);
            if (next.length > 0) {
              const sum = next.reduce((total, row) => total + (Number(row.stock) || 0), 0);
              props.setFieldValue("stock", sum);
            }
          }}
        />
        <div className="sm:col-span-4">
          <Textarea
            name="description"
            label="درباره محصول (فارسی)"
            onChange={(e) => props.setFieldValue("description", e.target.value)}
          />
        </div>
        <div className="sm:col-span-4">
          <Textarea
            name="body_en"
            label="About (English)"
            onChange={(e) => props.setFieldValue("body_en", e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center border-t border-[#14110e]/8 bg-[#f4efe6]/70 p-6 py-4">
        <button
          type="submit"
          className="ml-2 inline-flex items-center rounded-full bg-[#1f4a45] px-4 py-2 text-sm text-white"
        >
          {props.product ? "ثبت تغییرات" : "ایجاد محصول"}
        </button>
        <button
          onClick={() => router.push("/admin/products")}
          type="button"
          className="inline-flex items-center rounded-full border border-[#14110e]/12 bg-white px-4 py-2 text-sm"
        >
          انصراف
        </button>
      </div>
    </Form>
  );
}
