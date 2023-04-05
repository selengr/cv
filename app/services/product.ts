import { CreateProductInterface } from "../contracts/admin/products";
import callApi from "../helpers/callApi";



export async function GetProducts({ page = 1 , per_page = 2}) {
    let res = await callApi().get(`/products?page=${page}&per_page=${per_page}`);

    return { products : res?.data?.data , total_page : res?.data?.total_page };
}


export async function CreateProduct(values : CreateProductInterface) {
    return await callApi().post('/products/create' , {
        ...values,
        body : values.description,
        category : values.category_id
    });
}