import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../shared/models/domain/product.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
  imports: [CommonModule],
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCard {
  @Input({ required: true }) public product!: Product;
  @Input() public isInCart: boolean = false;
  @Output() public addToCart: EventEmitter<Product> = new EventEmitter<Product>();

  public onAddToCartClick(): void {
    if (!this.product.owned && !this.isInCart) {
      this.addToCart.emit(this.product);
    }
  }
}
