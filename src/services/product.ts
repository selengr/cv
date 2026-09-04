import { CreateProductInterface } from "@/contracts/admin/products";
import callApi from "@/helpers/callApi";

export async function GetProducts({ page = 1, per_page = 10 }) {
  const res = await callApi().get(`/products?page=${page}&per_page=${per_page}`);

  return { products: res?.data?.data, total_page: res?.data?.total_page };
}

export async function GetSingleProduct({ productId }: { productId: number }) {
  const res = await callApi().get(`/products/${productId}`);
  return res?.data;
}

export async function CreateProduct(values: CreateProductInterface) {
  return await callApi().post("/products/create", {
    ...values,
    body: values.description,
    category: values.category_id,
  });
}

export async function UpdateProduct(
  productId: number,
  values: CreateProductInterface,
) {
  return await callApi().post(`/products/${productId}/update`, {
    ...values,
    body: values.description,
    category: values.category_id,
  });
}

export async function DeleteProduct(productId: number) {
  return await callApi().post(`/products/${productId}/delete`, {});
}

export async function ToggleProductFeatured(productId: number) {
  const res = await callApi().post(`/products/${productId}/feature`, {});
  return res.data?.product;
}
