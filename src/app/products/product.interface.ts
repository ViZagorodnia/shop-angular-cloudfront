export interface Product {
  /** Available count */
  count: number;
  description: string;
  productId: string;
  price: number;
  title: string;
  img: string;
}

export interface ProductCheckout extends Product {
  orderedCount: number;
  /** orderedCount * price */
  totalPrice: number;
}
