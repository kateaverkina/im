import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {
  products: FavoriteType[] = [];

  constructor(private favoriteService: FavoriteService) {
  }

  ngOnInit() {
    this.favoriteService.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }

        this.products = data as FavoriteType[];
      });
  }

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorite(id)
      .subscribe((data: DefaultResponseType) => {
        if(data.error) {
          //..

          throw new Error(data.message);
        }

        this.products = this.products.filter(item => item.id !== id);
      })
  }
}
