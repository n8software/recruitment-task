import { TestBed } from '@angular/core/testing';
import { Product } from '../../../../shared/models/domain/product.model';
import { Cart } from './cart';

const mockProduct1: Product = { id: 1, name: 'Product A', price: 10.50, currency: 'PLN', image: '', owned: false };
const mockProduct2: Product = { id: 2, name: 'Product B', price: 20.00, currency: 'PLN', image: '', owned: false };

describe('Cart Service', () => {
  let cartService: Cart;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Cart]
    });
    cartService = TestBed.inject(Cart);
  });

  it('should be created', () => {
    expect(cartService).toBeTruthy();
  });

  it('should have an empty initial state', () => {
    expect(cartService.items()).toEqual([]);
    expect(cartService.totalItems()).toBe(0);
    expect(cartService.totalPrice()).toBe(0);
  });

  describe('addToCart', () => {
    it('should add a new product to the cart', () => {
      cartService.addToCart(mockProduct1);
      
      expect(cartService.items()).toEqual([mockProduct1]);
      expect(cartService.totalItems()).toBe(1);
      expect(cartService.totalPrice()).toBe(10.50);
    });

    it('should not add a product if it is already in the cart', () => {
      cartService.addToCart(mockProduct1);
      cartService.addToCart(mockProduct1);

      expect(cartService.totalItems()).toBe(1);
    });

    it('should add multiple different products to the cart', () => {
      cartService.addToCart(mockProduct1);
      cartService.addToCart(mockProduct2);

      expect(cartService.totalItems()).toBe(2);
      expect(cartService.totalPrice()).toBe(30.50);
      expect(cartService.items()).toContain(mockProduct1);
      expect(cartService.items()).toContain(mockProduct2);
    });
  });

  describe('removeFromCart', () => {
    beforeEach(() => {
      cartService.addToCart(mockProduct1);
      cartService.addToCart(mockProduct2);
    });

    it('should remove a product by its id', () => {
      cartService.removeFromCart(1);

      expect(cartService.totalItems()).toBe(1);
      expect(cartService.items()).toEqual([mockProduct2]);
      expect(cartService.totalPrice()).toBe(20.00);
    });

    it('should do nothing if product id does not exist in the cart', () => {
      cartService.removeFromCart(99);

      expect(cartService.totalItems()).toBe(2);
      expect(cartService.items()).toEqual([mockProduct1, mockProduct2]);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from the cart', () => {
      cartService.addToCart(mockProduct1);
      cartService.addToCart(mockProduct2);

      cartService.clearCart();

      expect(cartService.items()).toEqual([]);
      expect(cartService.totalItems()).toBe(0);
      expect(cartService.totalPrice()).toBe(0);
    });
  });

  describe('isProductInCart', () => {
    it('should return true if the product is in the cart', () => {
      cartService.addToCart(mockProduct1);
      expect(cartService.isProductInCart(1)).toBe(true);
    });

    it('should return false if the product is not in the cart', () => {
      cartService.addToCart(mockProduct1);
      expect(cartService.isProductInCart(2)).toBe(false);
    });
  });

  describe('Computed Signals', () => {
    it('should correctly return the currency of the first item', () => {
      cartService.addToCart(mockProduct1);
      cartService.addToCart(mockProduct2);

      expect(cartService.cartCurrency()).toBe('PLN');
    });

    it('should throw an error when accessing currency of an empty cart', () => {
      expect(() => cartService.cartCurrency()).toThrow();
    });
  });
});