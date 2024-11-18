import {CanActivateFn} from '@angular/router';
import {AuthService} from "./auth.service";
import {inject} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

export const authGuard: CanActivateFn = (route, state) => {
  const _snackBar = inject(MatSnackBar);

  const isLoggedIn = inject(AuthService).getIsLoggedIn();
  if(!isLoggedIn) {
    _snackBar.open('Для доступа необходимо авторизоваться');
  }
  return isLoggedIn;
};
