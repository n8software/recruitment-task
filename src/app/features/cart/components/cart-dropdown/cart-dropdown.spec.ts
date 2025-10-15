import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { computed, signal, WritableSignal } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';

import { Cart } from '../../services/cart/cart';
import { Product } from '../../../../shared/models/domain/product.model';
import { CartDropdown } from './cart-dropdown';

registerLocaleData(localePl);

const mockProduct1: Product = { id: 1, name: 'Product A', price: 10.50, currency: 'PLN', image: 'imgA.jpg', owned: false };
const mockProduct2: Product = { id: 2, name: 'Product B', price: 20.00, currency: 'PLN', image: 'imgB.jpg', owned: false };

describe('CartDropdownComponent', () => {
  let fixture: ComponentFixture<CartDropdown>;
  let component: CartDropdown;
  let mockCartService: {
    items: WritableSignal<Product[]>;
    totalItems: any;
    totalPrice: any;
    cartCurrency: any;
    clearCart: jasmine.Spy;
    removeFromCart: jasmine.Spy;
  };

  beforeEach(async () => {
    const itemsSignal = signal<Product[]>([]);

    mockCartService = {
      items: itemsSignal,
      totalItems: computed(() => itemsSignal().length),
      totalPrice: computed(() => itemsSignal().reduce((sum, item) => sum + item.price, 0)),
      cartCurrency: computed(() => (itemsSignal().length > 0 ? itemsSignal()[0].currency : 'PLN')),
      clearCart: jasmine.createSpy('clearCart').and.callFake(() => {
        itemsSignal.set([]);
      }),
      removeFromCart: jasmine.createSpy('removeFromCart').and.callFake((productId: number) => {
        itemsSignal.update(items => items.filter(item => item.id !== productId));
      }),
    };

    await TestBed.configureTestingModule({
      imports: [CartDropdown, CommonModule],
      providers: [
        { provide: Cart, useValue: mockCartService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CartDropdown);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Empty Cart View', () => {
    it('should display 0 items and 0 total price when cart is empty', () => {
      fixture.detectChanges();
      const element: HTMLElement = fixture.nativeElement;
      const itemsInfo = element.querySelector('.items-info');
      const totalPrice = element.querySelector('.total-price');
      const itemsList = element.querySelector('.cart-items-list');

      expect(itemsInfo?.textContent).toContain('0 ITEMS IN CART');
      expect(totalPrice?.textContent).toContain('0.00');
      expect(itemsList?.children.length).toBe(0);
    });
  });

  describe('Populated Cart View', () => {
    beforeEach(() => {
      mockCartService.items.set([mockProduct1, mockProduct2]);
      fixture.detectChanges();
    });

    it('should display the correct total item count and total price', () => {
      const element: HTMLElement = fixture.nativeElement;
      const itemsInfo = element.querySelector('.items-info');
      const totalPrice = element.querySelector('.total-price');

      expect(itemsInfo?.textContent).toContain('2 ITEMS IN CART');
      expect(totalPrice?.textContent).toContain('30.50');
    });

    it('should render a list of all items in the cart', () => {
      const items = fixture.debugElement.queryAll(By.css('.cart-item'));
      expect(items.length).toBe(2);
    });

    it('should display correct details for each cart item', () => {
      const element: HTMLElement = fixture.nativeElement;
      const firstItemName = element.querySelector('.cart-item .item-name');
      const firstItemPrice = element.querySelector('.cart-item .item-price');
      const firstItemImage = element.querySelector('.cart-item .item-image') as HTMLImageElement;

      expect(firstItemName?.textContent).toContain('Product A');
      expect(firstItemPrice?.textContent).toContain('10.50');
      expect(firstItemImage?.src).toContain('imgA.jpg');
    });
  });

  describe('User Interactions', () => {
    beforeEach(() => {
      mockCartService.items.set([mockProduct1, mockProduct2]);
      fixture.detectChanges();
    });

    it('should call cartService.clearCart when the "CLEAR CART" button is clicked', () => {
      const clearButton = fixture.debugElement.query(By.css('.clear-cart-btn'));
      clearButton.triggerEventHandler('click', null);
      
      expect(mockCartService.clearCart).toHaveBeenCalledTimes(1);
    });

    it('should show the remove button on mouseenter and hide it on mouseleave', () => {
      const firstItem = fixture.debugElement.query(By.css('.cart-item'));
      
      firstItem.triggerEventHandler('mouseenter', null);
      fixture.detectChanges();
      
      let removeButton = fixture.debugElement.query(By.css('.remove-item-btn'));
      expect(removeButton).toBeTruthy();
      
      firstItem.triggerEventHandler('mouseleave', null);
      fixture.detectChanges();

      removeButton = fixture.debugElement.query(By.css('.remove-item-btn'));
      expect(removeButton).toBeFalsy();
    });

    it('should call cartService.removeFromCart when the remove button is clicked', () => {
      const firstItem = fixture.debugElement.query(By.css('.cart-item'));
      
      firstItem.triggerEventHandler('mouseenter', null);
      fixture.detectChanges();
      
      const removeButton = fixture.debugElement.query(By.css('.remove-item-btn'));
      removeButton.triggerEventHandler('click', null);

      expect(mockCartService.removeFromCart).toHaveBeenCalledTimes(1);
      expect(mockCartService.removeFromCart).toHaveBeenCalledWith(mockProduct1.id);
    });

    it('should update the view after an item is removed', () => {
        const firstItem = fixture.debugElement.query(By.css('.cart-item'));
        firstItem.triggerEventHandler('mouseenter', null);
        fixture.detectChanges();
  
        const removeButton = fixture.debugElement.query(By.css('.remove-item-btn'));
        removeButton.triggerEventHandler('click', null);
        fixture.detectChanges();

        const items = fixture.debugElement.queryAll(By.css('.cart-item'));
        const itemsInfo = fixture.nativeElement.querySelector('.items-info');

        expect(items.length).toBe(1);
        expect(itemsInfo?.textContent).toContain('1 ITEMS IN CART');
    });
  });
});