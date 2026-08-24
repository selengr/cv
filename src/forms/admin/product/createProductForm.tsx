"use client";

import { withFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as yup from "yup";
import InnerProductForm from "@/components/admin/products/innerProductForm";
import { CreateProductInterface } from "@/contracts/admin/products";
import ValidationError from "@/exceptions/validationError";
import { CreateProduct } from "@/services/product";

const validationSchema = yup.object({
  title: yup.string().required("عنوان الزامی است").min(4).max(255),
  category_id: yup.number().required("دسته‌بندی الزامی است"),
  price: yup.number().min(0),
  description: yup.string().required("توضیحات الزامی است").min(4).max(6000),
});

function CreateProductFormWithRouter({
  router,
}: {
  router: ReturnType<typeof useRouter>;
}) {
  const Form = withFormik<{ router: ReturnType<typeof useRouter> }, CreateProductInterface>({
    mapPropsToValues: () => ({
      title: "",
      category_id: "",
      price: 0,
      description: "",
    }),
    validationSchema,
    handleSubmit: async (values, { props, setFieldError }) => {
      try {
        await CreateProduct(values);
        props.router.push("/admin/products");
        toast.success("محصول مورد نظر با موفقیت ثبت شد");
      } catch (error) {
        if (error instanceof ValidationError) {
          Object.entries(error.messages).forEach(([key, value]) =>
            setFieldError(key, value),
          );
          return;
        }

        toast.error("متاسفانه مشکلی در ثبت محصول وجود دارد.");
      }
    },
  })(InnerProductForm);

  return <Form router={router} />;
}

export default function CreateProductForm() {
  const router = useRouter();
  return <CreateProductFormWithRouter router={router} />;
}
