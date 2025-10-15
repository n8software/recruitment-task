export interface ProductDto {
  id: number;
  productName: string;
  priceInCents: number;
  currencyCode: string;
  imageUrl: string;
  isOwned: boolean;
  originalPriceInCents?: number;
}