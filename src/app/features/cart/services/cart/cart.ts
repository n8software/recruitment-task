import { computed, Injectable, signal } from '@angular/core';
import { Product } from '../../../../shared/models/domain/product.model';

@Injectable({
  providedIn: 'root'
})
export class Cart {
  private _cartItems = signal<Product[]>([]);

  public readonly items = this._cartItems.asReadonly();
  public readonly totalItems = computed(() => this._cartItems().length);
  public readonly totalPrice = computed(() =>
    this._cartItems().reduce((sum, item) => sum + item.price, 0)
  );

  public readonly cartCurrency = computed<string>(() => {
    const items = this._cartItems();
    return items[0].currency;
  });

  public addToCart(product: Product): void {
    if (this._cartItems().some(item => item.id === product.id)) {
      return;
    }
    this._cartItems.update(items => [...items, product]);
  }

  public removeFromCart(productId: number): void {
    this._cartItems.update(items => items.filter(item => item.id !== productId));
  }

  public clearCart(): void {
    this._cartItems.set([]);
  }

  public isProductInCart(productId: number): boolean {
    return this._cartItems().some(item => item.id === productId);
  }
}
