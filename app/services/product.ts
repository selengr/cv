import { CreateProductInterface } from "../contracts/admin/products";
import callApi from "../helpers/callApi";



export async function GetProducts({ page = 1 , per_page = 10}) {
    let res = await callApi().get(`/products?page=${page}&per_page=${per_page}`);

    return { products : res?.data?.data , total_page : res?.data?.total_page };
}

export async function GetSignleProduct({ productId } : { productId : number}) {
    console.log(productId)
    let res = await callApi().get(`/products/${productId}`);

    console.log(res?.data);
    return res?.data;
}


export async function CreateProduct(values : CreateProductInterface) {
    return await callApi().post('/products/create' , {
        ...values,
        body : values.description,
        category : values.category_id
    });
}


export async function UpdateProduct(productId  : number ,  values : CreateProductInterface) {
    return await callApi().post(`/products/${productId}/update` , {
        ...values,
        body : values.description,
        category : values.category_id
    });
}


export async function DeleteProduct(productId : number) {
    return await callApi().post(`/products/${productId}/delete` , {});
}