"use client";

import { Form, Formik } from "formik";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Spinner from "@/components/icons/spinner";
import Modal from "@/components/shared/modal";

interface Props {
  title: string;
  description: string;
  handleTrue: () => void;
  handleCancel: () => void;
}

export default function DeleteConfirmation({
  handleCancel,
  handleTrue,
  title,
  description,
}: Props) {
  return (
    <Modal show setShow={handleCancel}>
      <div className="my-8 inline-block w-full max-w-lg overflow-hidden rounded-lg bg-white text-right align-middle shadow-xl">
        <div className="flex items-center border-b px-4 py-5 text-gray-800">
          <ExclamationCircleIcon className="ml-2 h-7 w-7 text-red-600" />
          <h2 className="text-xl leading-tight font-bold">{title}</h2>
        </div>
        <div className="p-4">
          <p className="text-sm leading-relaxed text-gray-600">{description}</p>
        </div>
        <Formik initialValues={{}} onSubmit={handleTrue}>
          {({ isSubmitting }) => (
            <Form>
              <div className="flex items-center border-t border-gray-200 bg-gray-50 p-4">
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-1 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none sm:w-auto sm:justify-start"
                >
                  {isSubmitting && <Spinner className="ml-2 h-4 w-4" />}
                  حذف
                </button>
                <button
                  onClick={handleCancel}
                  type="button"
                  className="mr-2 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm leading-4 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:outline-none"
                >
                  انصراف
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
}
