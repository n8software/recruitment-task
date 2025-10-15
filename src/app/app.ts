import { Component, signal } from '@angular/core';
import { Header } from './layout/header/header';
import { ProductList } from './features/products/components/product-list/product-list';

@Component({
  selector: 'app-root',
  imports: [Header, ProductList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('gog-store');
}
