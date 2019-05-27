import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanActivate } from '@angular/router';
import { AuthenticationService } from '../services/auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdvancedRestrictGuard implements  CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

      return true;
    }
  
}
