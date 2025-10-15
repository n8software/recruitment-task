import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Product } from '../../../../shared/models/domain/product.model';

import { CommonModule, registerLocaleData } from '@angular/common';
import localePl from '@angular/common/locales/pl';
import { LOCALE_ID } from '@angular/core';
import { ProductCard } from './product-card';

registerLocaleData(localePl);

const mockProductNotOwned: Product = {
  id: 1,
  name: 'The Witcher 3: Wild Hunt',
  price: 29.99,
  currency: 'PLN',
  image: 'witcher.jpg',
  owned: false,
  originalPrice: 99.99,
  discountPercent: 70
};

const mockProductOwned: Product = {
  id: 2,
  name: 'Cyberpunk 2077',
  price: 199.99,
  currency: 'PLN',
  image: 'cyberpunk.jpg',
  owned: true,
};

describe('ProductCard Component', () => {
  let component: ProductCard;
  let fixture: ComponentFixture<ProductCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCard, CommonModule],
      providers: [
        { provide: LOCALE_ID, useValue: 'pl-PL' }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCard);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('Data Rendering', () => {
    it('should display product information correctly', () => {
      component.product = mockProductNotOwned;
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;
      const nameEl = element.querySelector('.product-name');
      const imageEl = element.querySelector('.product-image') as HTMLImageElement;
      const priceBtnEl = element.querySelector('.price-btn');

      expect(nameEl?.textContent).toContain('The Witcher 3: Wild Hunt');
      expect(imageEl?.src).toContain('witcher.jpg');
      
      expect(priceBtnEl?.textContent).toContain('29,99'); 
    });

    it('should display the discount tag if a discount is present', () => {
        component.product = mockProductNotOwned;
        fixture.detectChanges();
        const discountTag = fixture.nativeElement.querySelector('.discount-tag');
        expect(discountTag).toBeTruthy();
        expect(discountTag?.textContent).toContain('-70%');
    });

    it('should NOT display the discount tag if there is no discount', () => {
        component.product = mockProductOwned;
        fixture.detectChanges();
        const discountTag = fixture.nativeElement.querySelector('.discount-tag');
        expect(discountTag).toBeFalsy();
    });
  });

  describe('Add to Cart Logic', () => {
    it('should emit addToCart event when price button is clicked', () => {
      component.product = mockProductNotOwned;
      component.isInCart = false;
      fixture.detectChanges();
      spyOn(component.addToCart, 'emit');
      const priceButton = fixture.debugElement.query(By.css('.price-btn'));
      priceButton.triggerEventHandler('click', null);
      expect(component.addToCart.emit).toHaveBeenCalledWith(mockProductNotOwned);
    });
  });

  describe('DOM State based on Inputs', () => {
    it('should display the "OWNED" button if product is owned', () => {
      component.product = mockProductOwned;
      fixture.detectChanges();
      const ownedButton = fixture.nativeElement.querySelector('.owned-btn');
      expect(ownedButton).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.in-cart-btn')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('.price-btn')).toBeFalsy();
    });

    it('should display the "IN CART" button if product is in cart (and not owned)', () => {
      component.product = mockProductNotOwned;
      component.isInCart = true;
      fixture.detectChanges();
      const inCartButton = fixture.nativeElement.querySelector('.in-cart-btn');
      expect(inCartButton).toBeTruthy();
      expect(fixture.nativeElement.querySelector('.owned-btn')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('.price-btn')).toBeFalsy();
    });

     it('should display the price button by default (not owned, not in cart)', () => {
      component.product = mockProductNotOwned;
      component.isInCart = false;
      fixture.detectChanges();
      
      const priceButton = fixture.nativeElement.querySelector('.price-btn');
      expect(priceButton).toBeTruthy();

      expect(priceButton?.textContent).toContain('29,99'); 

      expect(fixture.nativeElement.querySelector('.owned-btn')).toBeFalsy();
      expect(fixture.nativeElement.querySelector('.in-cart-btn')).toBeFalsy();
    });
  });
});