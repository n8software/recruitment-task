import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { of } from 'rxjs';

import { Products } from '../../services/products/products';
import { Cart } from '../../../cart/services/cart/cart';
import { Product } from '../../../../shared/models/domain/product.model';
import { ProductList } from './product-list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  template: '',
  standalone: true,
})
class MockProductCardComponent {
  @Input({ required: true }) public product!: Product;
  @Input() public isInCart: boolean = false;
  @Output() public addToCart: EventEmitter<Product> = new EventEmitter<Product>();
}

const mockProducts: Product[] = [
  { id: 1, name: 'Product A', price: 10, currency: 'PLN', image: '', owned: false },
  { id: 2, name: 'Product B', price: 20, currency: 'PLN', image: '', owned: false },
  { id: 3, name: 'Product C', price: 30, currency: 'PLN', image: '', owned: true },
];

describe('ProductListComponent', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let productsServiceSpy: jasmine.SpyObj<Products>;
  let cartServiceSpy: jasmine.SpyObj<Cart>;

  beforeEach(async () => {
    productsServiceSpy = jasmine.createSpyObj('Products', ['getProducts']);
    cartServiceSpy = jasmine.createSpyObj('Cart', ['isProductInCart', 'addToCart']);

    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        { provide: Products, useValue: productsServiceSpy },
        { provide: Cart, useValue: cartServiceSpy },
      ]
    })
    .overrideComponent(ProductList, {
      set: {
        imports: [MockProductCardComponent, CommonModule],
      }
    })
    .compileComponents();

    productsServiceSpy.getProducts.and.returnValue(of(mockProducts));
    cartServiceSpy.isProductInCart.and.returnValue(false);
    
    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization and Data Loading', () => {
    it('should fetch products from ProductsService on initialization', () => {
      fixture.detectChanges(); 
      expect(productsServiceSpy.getProducts).toHaveBeenCalledTimes(1);
    });

    it('should render a list of app-product-card components when products are available', () => {
      fixture.detectChanges();
      
      const productCards = fixture.debugElement.queryAll(By.css('app-product-card'));
      
      expect(productCards.length).toBe(mockProducts.length);
    });
  });

  describe('Component Interaction', () => {
    it('should pass the correct product data to each product card', () => {
      fixture.detectChanges();
      
      const productCards = fixture.debugElement.queryAll(By.css('app-product-card'));
      const firstCardInstance = productCards[0].componentInstance as MockProductCardComponent;

      expect(firstCardInstance.product).toEqual(mockProducts[0]);
    });

    it('should pass the correct isInCart status to each product card', () => {
      cartServiceSpy.isProductInCart.and.callFake((productId: number) => {
        return productId === 2;
      });

      fixture.detectChanges();
      const productCards = fixture.debugElement.queryAll(By.css('app-product-card'));

      const firstCardInstance = productCards[0].componentInstance as MockProductCardComponent;
      const secondCardInstance = productCards[1].componentInstance as MockProductCardComponent;

      expect(cartServiceSpy.isProductInCart).toHaveBeenCalledWith(1);
      expect(cartServiceSpy.isProductInCart).toHaveBeenCalledWith(2);
      expect(firstCardInstance.isInCart).toBe(false);
      expect(secondCardInstance.isInCart).toBe(true);
    });

    it('should call cartService.addToCart when a product card emits addToCart event', () => {
      fixture.detectChanges();
      
      const productToEmit = mockProducts[1];
      const secondCardDebugElement = fixture.debugElement.queryAll(By.css('app-product-card'))[1];
      const secondCardInstance = secondCardDebugElement.componentInstance as MockProductCardComponent;

      secondCardInstance.addToCart.emit(productToEmit);
      
      expect(cartServiceSpy.addToCart).toHaveBeenCalledTimes(1);
      expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(productToEmit);
    });
  });
});