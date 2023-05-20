import Link from "next/link"
import { useRouter } from "next/router";
import Product from "../../../models/product";
import { useState } from "react";
import DeleteConfirmation from "../../shared/deleteConfimation";
import { toast } from "react-toastify";
import ValidationError from "../../../exceptions/validationError";
import { DeleteProduct } from "../../../services/product";
import { KeyedMutator } from "swr";
import Modal from "../../shared/modal";
import EditProductForm from "../../../forms/admin/product/editProductForm";

interface Props {
    product : Product,
    mutateProducts : KeyedMutator<{
        products: any;
        total_page: any;
    }>
}

export default function ProductListItem({ product , mutateProducts } : Props) {
    const [ showDeleteConfirmation , setShowDeleteConfirmation ] = useState<boolean>(false);
    const router = useRouter();

    const deleteHandler = async () => {
        try {
            
            await DeleteProduct(product.id);

            await mutateProducts();

            toast.success('محصول مورد نظر با موفقیت حذف شد')

            setShowDeleteConfirmation(false);

        } catch (error) {
            if(error instanceof ValidationError) {
                Object.entries(error.messages).forEach( ( [key , value] ) => toast.error(value as string))
                return;
            }

            toast.error('متاسفانه مشکلی در حذف محصول وجود دارد.')

            console.log(error)
        }

    }

    return (
            <tr>
                <td className="hidden">
                    {
                        `edit-product-${product.id}` in router.query &&  <Modal
                            setShow={() => router.push('/admin/products')}
                        >
                            <div className="inline-block w-full max-w-3xl mt-8 mb-20 overflow-hidden text-right align-middle transition-all transform bg-white shadow-xl rounded-lg opacity-100 scale-100">

                                <h2 className="text-xl font-bold leading-tight text-gray-800 py-5 px-7  border-b">ویرایش محصول</h2>
                                <EditProductForm product={product} mutateProducts={mutateProducts}/>
                            </div>
                        </Modal>
                    }

                    {
                        showDeleteConfirmation && 
                        <DeleteConfirmation 
                            title={`حذف مخصول ${product?.title}`}
                            description="آیا از حذف محصول مورد نظر خود اطمینان دارید یا خیر؟ در صورت تایید اطلاعات قابل بازگشت نخواهد بود"
                            handleTrue={deleteHandler}
                            handleCancel={() => setShowDeleteConfirmation(false)}
                        />
                    }
                </td>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                    {product.id}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.title}</td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <Link
                        href={`/admin/products?edit-product-${product.id}`}
                        as={`/admin/products/${product.id}/edit`}
                    >
                        <a
                            className="text-indigo-600 hover:text-indigo-900 ml-4"
                        >
                            ویرایش
                        </a>
                    </Link>
                    <button onClick={() => setShowDeleteConfirmation(true)} className="text-indigo-600 hover:text-indigo-900">
                        حذف
                    </button>
                </td>
            </tr>
    )
}