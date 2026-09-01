"use client";

import { withFormik } from "formik";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import * as yup from "yup";
import InnerProductForm from "@/components/admin/products/innerProductForm";
import { CreateProductInterface } from "@/contracts/admin/products";
import ValidationError, {
  applyFieldErrors,
} from "@/exceptions/validationError";
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
    title_en: "",
    category_id: "",
    price: 0,
    description: "",
    body_en: "",
    stock: 1,
    emoji: "📦",
    image: "",
  }),
  validationSchema: yup.object({
    title: yup.string().required("عنوان الزامی است").min(4).max(255),
    title_en: yup.string().max(255),
    category_id: yup.string().required("دسته‌بندی الزامی است"),
    price: yup.number().min(0),
    description: yup.string().required("توضیحات الزامی است").min(4).max(6000),
    body_en: yup.string().max(6000),
    stock: yup.number().min(0).required("موجودی الزامی است"),
    emoji: yup.string().required(),
    image: yup.string(),
  }),
  handleSubmit: async (values, { props, setFieldError }) => {
    try {
      await CreateProduct(values);
      props.router.push("/admin/products");
      toast.success("محصول مورد نظر با موفقیت ثبت شد");
    } catch (error) {
        if (error instanceof ValidationError) {
          applyFieldErrors(error.messages, setFieldError);
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
