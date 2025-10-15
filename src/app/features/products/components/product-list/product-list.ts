import { Component, inject } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../../../shared/models/domain/product.model';
import { Observable } from 'rxjs';
import { Products } from '../../services/products/products';
import { Cart } from '../../../cart/services/cart/cart';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, ProductCard],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList {
  private productsService = inject(Products);
  public cartService = inject(Cart);

  public products$: Observable<Product[]>;

  constructor() {
    this.products$ = this.productsService.getProducts();
  }

  public onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
