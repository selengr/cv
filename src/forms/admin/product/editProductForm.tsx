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

const validationSchema = yup.object({
  title: yup.string().required("عنوان الزامی است").min(4).max(255),
  category_id: yup.number().required("دسته‌بندی الزامی است"),
  price: yup.number().min(0),
  description: yup.string().required("توضیحات الزامی است").min(4).max(6000),
});

interface ProductFormProps {
  product: Product;
  mutateProducts?: KeyedMutator<{
    products: Product[];
    total_page: number;
  }>;
}

function EditProductFormWithRouter(
  props: ProductFormProps & { router: ReturnType<typeof useRouter> },
) {
  const Form = withFormik<typeof props, CreateProductInterface>({
    mapPropsToValues: ({ product }) => ({
      title: product.title,
      category_id: product.category ?? "",
      price: product.price,
      description: product.body,
    }),
    validationSchema,
    handleSubmit: async (values, { props: formProps, setFieldError }) => {
      try {
        await UpdateProduct(formProps.product.id, values);
        await formProps.mutateProducts?.();
        formProps.router.push("/admin/products");
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
  })(InnerProductForm);

  return <Form {...props} />;
}

export default function EditProductForm(props: ProductFormProps) {
  const router = useRouter();
  return <EditProductFormWithRouter {...props} router={router} />;
}
