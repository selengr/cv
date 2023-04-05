import { withFormik } from "formik";
import Router from "next/router";
import { toast } from "react-toastify";
import * as yup from "yup";
import InnerCreateProductForm from "../../../components/admin/products/innerCreateProductForm";
import { CreateProductInterface } from "../../../contracts/admin/products";

import ValidationError from "../../../exceptions/validationError";
import callApi from "../../../helpers/callApi";
import { CreateProduct } from "../../../services/product";


const validationSchema = yup.object().shape({
    title : yup.string().required().min(4).max(255),
    category_id : yup.number().required(),
    price : yup.string().min(0),
    description : yup.string().required().min(4).max(6000)
});

interface ProductFormProps {
}

const CreateProductForm = withFormik<ProductFormProps , CreateProductInterface>({
    mapPropsToValues : props => ({
        title : '',
        category_id : '',
        price : 0,
        description : ''
    }),
    validationSchema: validationSchema,
    handleSubmit : async (values , { props , setFieldError }) => {
        try {
            console.log(values);
            
            await CreateProduct(values);

            Router.push('/admin/products');

            toast.success('محصول مورد نظر با موفقیت ثبت شد')

        } catch (error) {
            if(error instanceof ValidationError) {
                Object.entries(error.messages).forEach( ( [key , value] ) => setFieldError(key , value as string))
                return;
            }

            toast.success('متاسفانه مشکلی در ثبت محصول وجود دارد.')

            console.log(error)
        }

    }
})(InnerCreateProductForm)

export default CreateProductForm;