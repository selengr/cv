export type ProductVariant = {
  id: number;
  size?: string;
  color?: string;
  stock: number;
  /** optional price override; otherwise product.price */
  price?: number;
};

export default interface Product {
  id: number;
  title: string;
  category?: string;
  body: string;
  price: number;
  user_id: number;
  created_at: string;
  stock?: number;
  emoji?: string;
  image?: string;
  title_en?: string;
  body_en?: string;
  ratingAvg?: number;
  reviewCount?: number;
  variants?: ProductVariant[];
}
