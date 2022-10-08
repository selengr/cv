import {  withFormik } from "formik";
import Router from "next/router";
import * as yup from "yup";

import InnerRegisterForm from "../../components/auth/innerRegisterForm";
import { RegisterFormValuesInterface } from "../../contracts/auth";
import callApi from "../../helpers/callApi";


const registerFormValidationSchema = yup.object().shape({
    name : yup.string().required().min(4),
    email : yup.string().required().email(),
    password : yup.string().required().min(8)
})

interface RegisterFormProps {
}

const RegisterForm = withFormik<RegisterFormProps , RegisterFormValuesInterface>({
    mapPropsToValues : props => ({
        name : '',
        email : '',
        password : ''
    }),
    validationSchema: registerFormValidationSchema,
    handleSubmit : async (values) => {
        const res = await callApi().post('/auth/register' , values);
        if(res.status === 201) {
            Router.push('/auth/login')
        }
    }
})(InnerRegisterForm)

export default RegisterForm;