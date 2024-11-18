import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {CartService} from "../../services/cart.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {FavoriteService} from "../../services/favorite.service";
import {ProductType} from "../../../../types/product.type";
import {Router} from "@angular/router";

@Component({
  selector: 'favorite-product-card',
  templateUrl: './favorite-product-card.component.html',
  styleUrl: './favorite-product-card.component.scss'
})
export class FavoriteProductCardComponent implements OnInit {

  @Input() product!: FavoriteType;
  @Output() removeFromFavoriteEvent: EventEmitter<FavoriteType> = new EventEmitter<FavoriteType>();

  serverStaticPath = environment.serverStaticPath;


  count: number = 1;
  cart: CartType | null = null;

  constructor(private cartService: CartService,
              private favoriteService: FavoriteService) {
  }

  ngOnInit() {
    this.cartService.getCart()
      .subscribe((cartData: CartType | DefaultResponseType) => {
        if ((cartData as DefaultResponseType).error !== undefined) {
          throw new Error((cartData as DefaultResponseType).message);
        }

        const cartDataResponse = cartData as CartType;

        if (cartDataResponse) {
          const productInCart =
            cartDataResponse.items.find(item => item.product.id === this.product.id);
          if (productInCart) {
            this.product.countInCart = productInCart.quantity;
            this.count = this.product.countInCart;
          }
        }
      });
  }

  addToCart(id: string) {
    this.cartService.updateCart(id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        this.product.countInCart = this.count;
      });

  }

  removeFromCart(id: string) {
    this.cartService.updateCart(id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        this.product.countInCart = 0;
        this.count = 1;
      });
  }

  updateCount(id: string, value: number) {
    this.count = value;
    if (this.product.countInCart) {
      this.cartService.updateCart(id, this.count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            const error = (data as DefaultResponseType).message;
            throw new Error(error);
          }
          this.product.countInCart = this.count;
        });
    }
  }

  removeFromFavorites(id: string) {
    this.product.id = id;

    this.removeFromFavoriteEvent.emit(this.product);
  }
}
