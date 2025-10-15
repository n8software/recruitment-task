export interface Product {
  id: number;
  name: string;
  price: number;
  currency: string;
  image: string;
  owned: boolean;
  originalPrice?: number;
	discountPercent?: number;
}