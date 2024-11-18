import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from "./auth.service";
import {inject} from "@angular/core";

export const authForwardGuard: CanActivateFn = (route, state) => {
  return inject(AuthService).getIsLoggedIn()
    ? inject(Router).createUrlTree(['/'])
    : true;
};
