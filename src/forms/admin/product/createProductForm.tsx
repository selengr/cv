"use client";

import { withFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as yup from "yup";
import InnerProductForm from "@/components/admin/products/innerProductForm";
import { CreateProductInterface } from "@/contracts/admin/products";
import ValidationError from "@/exceptions/validationError";
import { CreateProduct } from "@/services/product";

interface CreateFormProps {
  router: ReturnType<typeof useRouter>;
}

const FormikCreateProductForm = withFormik<
  CreateFormProps,
  CreateProductInterface
>({
  mapPropsToValues: () => ({
    title: "",
    category_id: "",
    price: 0,
    description: "",
  }),
  validationSchema: yup.object({
    title: yup.string().required("عنوان الزامی است").min(4).max(255),
    category_id: yup.number().required("دسته‌بندی الزامی است"),
    price: yup.number().min(0),
    description: yup.string().required("توضیحات الزامی است").min(4).max(6000),
  }),
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

export default function CreateProductForm() {
  const router = useRouter();
  return <FormikCreateProductForm router={router} />;
}
