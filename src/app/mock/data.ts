import { ProductDto } from "../shared/models/dto/product.dto";

export const MOCK_PRODUCTS: ProductDto[] = [
  {
    id: 1,
    productName: 'ODDWORLD: STRANGER\'S WRATH',
    priceInCents: 999,
    currencyCode: 'USD',
    originalPriceInCents: 1998,
    imageUrl: 'assets/images/products/oddworld-strangers-wrath.webp',
    isOwned: false,
  },
  {
    id: 2,
    productName: 'CHAOS ON DEPONIA',
    priceInCents: 1999,
    currencyCode: 'USD',
    originalPriceInCents: undefined,
    imageUrl: 'assets/images/products/chaos-on-deponia.webp',
    isOwned: true,
  },
  {
    id: 3,
    productName: 'THE SETTLERS 2: GOLD EDITION',
    priceInCents: 599,
    currencyCode: 'USD',
    originalPriceInCents: undefined,
    imageUrl: 'assets/images/products/the-settlers-2-gold.webp',
    isOwned: false,
  },
  {
    id: 4,
    productName: 'NEVERWINTER NIGHTS',
    priceInCents: 999,
    currencyCode: 'USD',
    originalPriceInCents: 1998,
    imageUrl: 'assets/images/products/neverwinter-nights.webp',
    isOwned: false,
  },
  {
    id: 5,
    productName: 'ASSASSIN\'S CREED: DIRECTOR\'S CUT',
    priceInCents: 999,
    currencyCode: 'USD',
    originalPriceInCents: undefined,
    imageUrl: 'assets/images/products/assassins-creed-directors-cut.webp',
    isOwned: false,
  },
];