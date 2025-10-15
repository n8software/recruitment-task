import { TestBed } from '@angular/core/testing';
import { ProductDto } from '../../../../shared/models/dto/product.dto';
import { of } from 'rxjs';

import { Products } from './products';
import { ProductsApi } from '../../../../mock/products.api';

describe('Products Service', () => {
  let productsService: Products;
  let productsApiSpy: jasmine.SpyObj<ProductsApi>;

  const mockDtos: ProductDto[] = [
    {
      id: 1,
      productName: 'The Witcher 3: Wild Hunt',
      priceInCents: 2999,
      originalPriceInCents: 9999,
      currencyCode: 'PLN',
      imageUrl: 'image1.url',
      isOwned: false,
    },
    {
      id: 2,
      productName: 'Cyberpunk 2077',
      priceInCents: 19999,
      originalPriceInCents: undefined,
      currencyCode: 'PLN',
      imageUrl: 'image2.url',
      isOwned: true,
    },
    {
      id: 3,
      productName: 'Baldur\'s Gate 3',
      priceInCents: 24900,
      originalPriceInCents: 24900,
      currencyCode: 'PLN',
      imageUrl: 'image3.url',
      isOwned: false,
    },
    {
      id: 5,
      productName: 'Game with tricky discount',
      priceInCents: 3333,
      originalPriceInCents: 9999,
      currencyCode: 'PLN',
      imageUrl: 'image4.url',
      isOwned: false,
    }
  ];

  beforeEach(() => {
    productsApiSpy = jasmine.createSpyObj('ProductsApi', ['fetchProducts']);

    TestBed.configureTestingModule({
      providers: [
        Products,
        { provide: ProductsApi, useValue: productsApiSpy }
      ]
    });

    productsService = TestBed.inject(Products);
  });

  it('should be created', () => {
    expect(productsService).toBeTruthy();
  });

  describe('getProducts', () => {

    it('should correctly map all DTO properties to the Product model', (done) => {
      const testDto = mockDtos[0];
      productsApiSpy.fetchProducts.and.returnValue(of([testDto]));

      productsService.getProducts().subscribe(products => {
        const product = products[0];

        expect(products.length).toBe(1);
        expect(product.id).toBe(testDto.id);
        expect(product.name).toBe(testDto.productName);
        expect(product.price).toBe(29.99);
        expect(product.originalPrice).toBe(99.99);
        expect(product.currency).toBe(testDto.currencyCode);
        expect(product.image).toBe(testDto.imageUrl);
        expect(product.owned).toBe(testDto.isOwned);

        expect(productsApiSpy.fetchProducts).toHaveBeenCalledTimes(1);
        done();
      });
    });

    it('should handle products without an original price', (done) => {
      const productWithoutOriginalPrice = mockDtos[1];
      productsApiSpy.fetchProducts.and.returnValue(of([productWithoutOriginalPrice]));

      productsService.getProducts().subscribe(products => {
        const product = products[0];

        expect(product.originalPrice).toBeUndefined();
        expect(product.discountPercent).toBeUndefined();
        done();
      });
    });

    it('should calculate discount percent correctly when original price is greater than current price', (done) => {
      const productWithDiscount = mockDtos[0];
      productsApiSpy.fetchProducts.and.returnValue(of([productWithDiscount]));

      productsService.getProducts().subscribe(products => {
        const product = products[0];
        expect(product.discountPercent).toBe(70);
        done();
      });
    });

    it('should round the discount percentage correctly', (done) => {
      const productWithRounding = mockDtos[3];
      productsApiSpy.fetchProducts.and.returnValue(of([productWithRounding]));

      productsService.getProducts().subscribe(products => {
        const product = products[0];
        expect(product.discountPercent).toBe(67);
        done();
      });
    });

    it('should not calculate discount if original price is equal to the current price', (done) => {
      const productWithoutDiscount = mockDtos[2];
      productsApiSpy.fetchProducts.and.returnValue(of([productWithoutDiscount]));

      productsService.getProducts().subscribe(products => {
        const product = products[0];

        expect(product.originalPrice).toBe(249.00);
        expect(product.discountPercent).toBeUndefined();
        done();
      });
    });

    it('should return an empty array if the API returns an empty array', (done) => {
      productsApiSpy.fetchProducts.and.returnValue(of([]));

      productsService.getProducts().subscribe(products => {
        expect(products).toEqual([]);
        expect(products.length).toBe(0);
        done();
      });
    });

    it('should call the mapping logic for each item returned by the API', (done) => {
      productsApiSpy.fetchProducts.and.returnValue(of(mockDtos));

      productsService.getProducts().subscribe(products => {
          expect(products.length).toBe(mockDtos.length);
          expect(products[0].name).toBe('The Witcher 3: Wild Hunt');
          expect(products[1].name).toBe('Cyberpunk 2077');
          expect(products[2].name).toBe('Baldur\'s Gate 3');
          expect(products[3].name).toBe('Game with tricky discount');
          done();
      });
    });
  });
});