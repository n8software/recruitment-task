import { Component, inject } from '@angular/core';
import { Cart } from '../../features/cart/services/cart/cart';
import { CartDropdown } from '../../features/cart/components/cart-dropdown/cart-dropdown';

@Component({
  selector: 'app-header',
  imports: [CartDropdown],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header {
  public cartService = inject(Cart);
  public isCartOpen = false;
}
