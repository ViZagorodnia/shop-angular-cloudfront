import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  viewChild,
} from '@angular/core';
import { Product } from '../product.interface';
import { CartService } from '../../cart/cart.service';
import { CartCountControlsComponent } from '../../core/cart-count-controls/cart-count-controls.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton } from '@angular/material/button';
import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardImage,
  MatCardTitle,
} from '@angular/material/card';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  standalone: true,
  imports: [
    MatCard,
    MatCardImage,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatIconButton,
    MatTooltip,
    MatIcon,
    CartCountControlsComponent,
    AsyncPipe,
    DecimalPipe,
    CurrencyPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemComponent {
  product = input.required<Product>();
  index = input.required<number>();

  cartBtn = viewChild('cartBtn', { read: ElementRef<HTMLButtonElement> });
  countControls = viewChild('controls', { read: CartCountControlsComponent });

  #injector = inject(Injector);
  #cartService = inject(CartService);

  countInCart = computed(() => {
    const cart = this.#cartService.cart();

    if (!(this.productId in cart)) {
      return 0;
    }

    return cart[this.productId];
  });

  get productId(): string {
    return this.product().productId;
  }

  constructor() {
    this.updateFocusIfNeeded();
  }

  add(): void {
    this.#cartService.addItem(this.productId);
  }

  remove(): void {
    this.#cartService.removeItem(this.productId);
  }

  /** Move focus to a corresponding control when controls switch */
  private updateFocusIfNeeded() {
    let prev: number;

    effect(() => {
      const curr = this.countInCart();

      if (prev === 0 && curr === 1) {
        setTimeout(() => this.countControls()?.focusAddBtn());
      } else if (prev === 1 && curr === 0) {
        setTimeout(() => this.cartBtn()?.nativeElement.focus());
      }

      prev = curr;
    });
  }
}
