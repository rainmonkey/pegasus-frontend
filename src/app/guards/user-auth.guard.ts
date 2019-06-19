import { Injectable } from '@angular/core';
import { CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivateChild {
  constructor(
    private authService: AuthenticationService,
    private router: Router
    ){}

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // throw new Error("Method not implemented.");
      let url: string = state.url;
      console.log(url);
      return true;
      //   return this.checkUser(url);
  }
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   let url: string = state.url;
  //   console.log(url);
  //   return true;

  // }
  // checkUser(url){
  //   if(this.authService.userState > 1){return true;}
  //   this.router.navigate(['/login'])
  //   return false;
  // }

}
