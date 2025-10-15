import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component, signal, WritableSignal } from '@angular/core';
import { Cart } from '../../features/cart/services/cart/cart';
import { Header } from './header';

@Component({
  selector: 'app-cart-dropdown',
  template: '',
  standalone: true,
})
class MockCartDropdownComponent {}

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<Header>;
  let component: Header;
  let mockCartService: {
    totalItems: WritableSignal<number>;
  };

  beforeEach(async () => {
    mockCartService = {
      totalItems: signal(0),
    };

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        { provide: Cart, useValue: mockCartService }
      ]
    })
    .overrideComponent(Header, {
      set: {
        imports: [MockCartDropdownComponent]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the logo', () => {
    fixture.detectChanges();
    const logo = fixture.debugElement.query(By.css('.logo'));
    expect(logo).toBeTruthy();
  });

  describe('Cart Item Count Display', () => {
    it('should display 0 when the cart is empty', () => {
      mockCartService.totalItems.set(0);
      fixture.detectChanges();
      
      const countElement = fixture.nativeElement.querySelector('.cart-items-count');
      expect(countElement.textContent).toContain('0');
    });

    it('should display the correct number of items when the cart is populated', () => {
      mockCartService.totalItems.set(5);
      fixture.detectChanges();
      
      const countElement = fixture.nativeElement.querySelector('.cart-items-count');
      expect(countElement.textContent).toContain('5');
    });
  });

  describe('Cart Dropdown Visibility', () => {
    it('should not show the dropdown initially', () => {
      fixture.detectChanges();
      const dropdown = fixture.debugElement.query(By.css('app-cart-dropdown'));
      expect(dropdown).toBeFalsy();
    });

    it('should not show the dropdown on mouseenter when cart is empty', () => {
      mockCartService.totalItems.set(0);
      fixture.detectChanges();
      
      const cartSection = fixture.debugElement.query(By.css('.cart-section'));
      cartSection.triggerEventHandler('mouseenter', null);
      fixture.detectChanges();

      const dropdown = fixture.debugElement.query(By.css('app-cart-dropdown'));
      expect(dropdown).toBeFalsy();
    });

    it('should show the dropdown on mouseenter when cart has items', () => {
      mockCartService.totalItems.set(1);
      fixture.detectChanges();
      
      const cartSection = fixture.debugElement.query(By.css('.cart-section'));
      cartSection.triggerEventHandler('mouseenter', null);
      fixture.detectChanges();

      const dropdown = fixture.debugElement.query(By.css('app-cart-dropdown'));
      expect(dropdown).toBeTruthy();
    });

    it('should hide the dropdown on mouseleave after it was shown', () => {
      mockCartService.totalItems.set(1);
      fixture.detectChanges();
      
      const cartSection = fixture.debugElement.query(By.css('.cart-section'));
      
      cartSection.triggerEventHandler('mouseenter', null);
      fixture.detectChanges();
      
      let dropdown = fixture.debugElement.query(By.css('app-cart-dropdown'));
      expect(dropdown).toBeTruthy();
      
      cartSection.triggerEventHandler('mouseleave', null);
      fixture.detectChanges();

      dropdown = fixture.debugElement.query(By.css('app-cart-dropdown'));
      expect(dropdown).toBeFalsy();
    });

    it('should hide the dropdown if cart becomes empty while it is open', () => {
      mockCartService.totalItems.set(1);
      fixture.detectChanges();
      
      const cartSection = fixture.debugElement.query(By.css('.cart-section'));
      cartSection.triggerEventHandler('mouseenter', null);
      fixture.detectChanges();

      let dropdown = fixture.debugElement.query(By.css('app-cart-dropdown'));
      expect(dropdown).toBeTruthy();

      mockCartService.totalItems.set(0);
      fixture.detectChanges();

      dropdown = fixture.debugElement.query(By.css('app-cart-dropdown'));
      expect(dropdown).toBeFalsy();
    });
  });
});