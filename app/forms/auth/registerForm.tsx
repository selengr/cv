import { Form, FormikProps, withFormik } from "formik";
import Input from "../../components/shared/form/input";

interface RegisterFormValues {
    name: string,
    email: string,
    password: string
}

const InnerRegisterForm = (props : FormikProps<RegisterFormValues>) => {
    return (
        <Form className="space-y-6">
            <div>
                <Input name='name' label="Your name"/>
            </div>

            <div>
                <Input name='email' type='email' label="Email Address"/>
            </div>

            <div>
                <Input name='password' type='password' label="Password"/>
            </div>

            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Register
                </button>
            </div>
        </Form>
    )
}

interface RegisterFormProps {
    name? : string
}

const RegisterForm = withFormik<RegisterFormProps , RegisterFormValues>({
    mapPropsToValues : props => {
        return {
            name : props.name ?? '',
            email : '',
            password : ''
        }
    },
    handleSubmit : (values) => {
        console.log(values);
    }
})(InnerRegisterForm)

export default RegisterForm;