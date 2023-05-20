import { Form, Formik } from "formik"
import Spinner from "../icons/spinner"
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"
import Modal from "./modal"

interface Props {
    title : string,
    description : string,
    handleTrue : () => void,
    handleCancel : () => void
}

export default function DeleteConfirmation({ handleCancel , handleTrue , title , description } : Props) {
    return (
        <Modal show={true} setShow={handleCancel}>
            <div className="inline-block w-full max-w-lg my-8 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-lg">
                <div className={`flex items-center py-5 px-4  text-gray-800 border-b `}>
                    <ExclamationCircleIcon className="w-7 h-7 ml-2 text-red-600" />
                    <h2 className="text-xl font-bold leading-tight">
                        { title }
                    </h2>
                </div>
                <div className="p-4">
                    <p className="text-gray-600 leading-relaxed text-sm">{ description }</p>
                </div>
                <Formik
                    initialValues={{}}
                    onSubmit={handleTrue}
                 >
                    {({ isSubmitting}) => (
                        <Form>
                            <div className="p-4 py-4 bg-gray-50 border-t border-gray-200 flex items-center">
                                <button type="submit"
                                        className="inline-flex items-center border font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 w-full sm:w-auto justify-center sm:justify-start px-4 py-1 text-sm text-white border-transparent bg-red-600 hover:bg-red-700 focus:ring-red-500">
                                    { isSubmitting && <Spinner className="w-4 h-4 ml-2"/> }
                                    حذف
                                </button>
                                <button onClick={handleCancel} type="button"
                                        className="inline-flex items-center px-3 mr-2 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
                                    انصراف
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Modal>
    )
}