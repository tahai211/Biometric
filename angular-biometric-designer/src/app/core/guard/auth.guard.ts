import { Injectable } from '@angular/core';
import { RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/services/token.services';

@Injectable()
export class AuthGuard {
  constructor(
    private router: Router,
    private tokenService: TokenService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // if (localStorage.getItem('isLoggedin')) {
    //   // logged in so return true
    //   return true;
    // }

    // // not logged in so redirect to login page with the return url
    // this.router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
    // return false;
    var check = this.tokenService.checkLogin();
    // console.log('check-login: ', check);
    if (check) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.tokenService.logout();
    return false;
  }
}