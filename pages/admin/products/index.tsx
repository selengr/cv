import { useEffect, useState } from 'react';
import AdminPanelLayout from "../../../app/components/adminPanelLayout";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { NextPageWithLayout } from "../../_app";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import Input from '../../../app/components/shared/form/input';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Modal from '../../../app/components/shared/modal';
import CreateProductForm from '../../../app/forms/admin/product/createProductForm';
import useSWR from 'swr';
import { GetProducts } from '../../../app/services/product';
import LoadingBox from '../../../app/components/shared/loadingBox';
import Product from '../../../app/models/product';
import { toast } from 'react-toastify';
import ReactCustomPaginate from '../../../app/components/shared/reactCutsomPaginate';
import EmptyList from '../../../app/components/shared/emptyList';

const ProductList: NextPageWithLayout = () => {
    // const [showCreateProduct , setShowCreateProduct] = useState(false);
    const [ page , setPage ] = useState(1);

    const router = useRouter();
    const { page : queryPage } = router.query;
    const {data , error } = useSWR({ url : '/admin/products' , page } , GetProducts)
    const loadingProducts = !data && !error;


    useEffect(() => {
        setPage(parseInt(queryPage))
    }, [queryPage])
    
    const setShowCreateProduct = (show = true) => {
        router.push(`/admin/products${show ? '?create-product' : ''}`);
    }
    
    
    const onPageChangeHandler = ({ selected }  : { selected : number}) => router.push(`/admin/products?page=${selected + 1}`)


    return (
        <>
            {
                'create-product' in router.query &&  <Modal
                setShow={() => setShowCreateProduct(false)}
            >
                <div className="inline-block w-full max-w-3xl mt-8 mb-20 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-lg opacity-100 scale-100">

                    <h2 className="text-xl font-bold leading-tight text-gray-800 py-5 px-7  border-b">ساخت محصول</h2>
                    <CreateProductForm />
                </div>
            </Modal>
            }

           

            

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900">لیست محصولات</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            در این صفحه لیست محصولات وبسایت به شما نمایش داده می‌شود
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:mr-16 sm:flex-none">
                        <Link
                            href="/admin/products?create-product"
                            as="/admin/products/create"
                        >
                            <a
                                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                            >
                                اضافه کردن محصول
                            </a>
                        </Link>
                    </div>
                </div>
                <div className="mt-8 flex flex-col">
                    <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">

                                {
                                    loadingProducts 
                                    ? <div className='p-5'>
                                        <LoadingBox />
                                    </div>
                                    : data?.products?.length > 0 
                                        ? <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900 sm:pl-6">
                                                    شماره محصول
                                                </th>
                                                <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
                                                    عنوان
                                                </th>
                                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {data?.products.map((product : Product) => (
                                                <tr key={product.id}>
                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                                        {product.id}
                                                    </td>
                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.title}</td>
                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                        <a href="#" className="text-indigo-600 hover:text-indigo-900 ml-4">
                                                            ویرایش
                                                        </a>
                                                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                            حذف
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    : <div className='p-5'>
                                        <EmptyList title="محصولی برای نمایش وجود ندارد" description='در حال حاضر محصول وجود ندارد می‌توانید یک محصول اضافه کنید'/>
                                    </div>
                                }
                                

                                {
                                    data?.total_page > 1 && <div className="p-4 mt-2 border-t border-gray-200">
                                            <ReactCustomPaginate
                                                onPageChangeHandler={onPageChangeHandler}
                                                pageCount={data?.total_page}
                                                page={page}
                                            />
                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

ProductList.getLayout = (page) => <AdminPanelLayout>{page}</AdminPanelLayout>

export default ProductList;