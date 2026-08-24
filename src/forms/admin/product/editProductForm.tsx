"use client";

import { withFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as yup from "yup";
import type { KeyedMutator } from "swr";
import InnerProductForm from "@/components/admin/products/innerProductForm";
import { CreateProductInterface } from "@/contracts/admin/products";
import ValidationError from "@/exceptions/validationError";
import Product from "@/models/product";
import { UpdateProduct } from "@/services/product";

interface ProductFormProps {
  product: Product;
  mutateProducts?: KeyedMutator<{
    products: Product[];
    total_page: number;
  }>;
  router: ReturnType<typeof useRouter>;
}

const FormikEditProductForm = withFormik<ProductFormProps, CreateProductInterface>(
  {
    mapPropsToValues: ({ product }) => ({
      title: product.title,
      category_id: product.category ?? "",
      price: product.price,
      description: product.body,
    }),
    validationSchema: yup.object({
      title: yup.string().required("عنوان الزامی است").min(4).max(255),
      category_id: yup.number().required("دسته‌بندی الزامی است"),
      price: yup.number().min(0),
      description: yup.string().required("توضیحات الزامی است").min(4).max(6000),
    }),
    handleSubmit: async (values, { props, setFieldError }) => {
      try {
        await UpdateProduct(props.product.id, values);
        await props.mutateProducts?.();
        props.router.push("/admin/products");
        toast.success("محصول مورد نظر با موفقیت ویرایش شد");
      } catch (error) {
        if (error instanceof ValidationError) {
          Object.entries(error.messages).forEach(([key, value]) =>
            setFieldError(key, value),
          );
          return;
        }

        toast.error("متاسفانه مشکلی در ویرایش محصول وجود دارد.");
      }
    },
  },
)(InnerProductForm);

export default function EditProductForm(
  props: Omit<ProductFormProps, "router">,
) {
  const router = useRouter();
  return <FormikEditProductForm {...props} router={router} />;
}
