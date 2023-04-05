export default interface Product {
    id: number;
    title : string,
    category? : string,
    body : string,
    price : number
    user_id : number,
    created_at : string
}