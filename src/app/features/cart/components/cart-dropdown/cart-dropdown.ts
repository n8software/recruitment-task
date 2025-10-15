import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Cart } from '../../services/cart/cart';

@Component({
  selector: 'app-cart-dropdown',
  imports: [CommonModule],
  templateUrl: './cart-dropdown.html',
  styleUrl: './cart-dropdown.scss'
})
export class CartDropdown {
  public cartService = inject(Cart);
  public itemHovered: number | null = null;
}
