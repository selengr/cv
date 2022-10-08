import { withFormik } from "formik";
import * as yup from "yup";

import InnerLoginForm from "../../components/auth/innerLoginForm";
import { LoginFormValuesInterface } from "../../contracts/auth";
import callApi from "../../helpers/callApi";

const loginFormValidationSchema = yup.object().shape({
    email : yup.string().required().email(),
    password : yup.string().required().min(8)
})

interface LoginFormProps {
    setCookie : any
}

const LoginForm = withFormik<LoginFormProps , LoginFormValuesInterface>({
    mapPropsToValues : props => ({
        email : '',
        password : ''
    }),
    validationSchema: loginFormValidationSchema,
    handleSubmit : async (values , { props }) => {
        const res = await callApi().post('/auth/login' , values)
        if(res.status === 200) {
            props.setCookie('shopy-token' , res.data.token , {
                'maxAge' : 3600 * 24 * 30,
                'domain' : 'localhost',
                'path' : '/',
                'sameSite' : 'lax'
            })
        }

    }
})(InnerLoginForm)

export default LoginForm;