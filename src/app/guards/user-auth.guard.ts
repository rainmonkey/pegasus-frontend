import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/auth/authentication.service';
import { GeneralRepoService } from '../services/repositories/general-repo.service';
@Injectable({
  providedIn: 'root'
})
export class UserAuthGuard implements CanActivate {
  constructor(
    private authService: GeneralRepoService,
    private router: Router
    ){}
    pathArray=[];

  canActivate(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    // throw new Error("Method not implemented.");
    return true;
      let url: string = state.url;
      let urlS = url.substring(1,url.length-0);
      return this.checkUser(urlS);
      // console.log(urlS);
      // console.log(this.authService.giveAuthToGuard(urlS))
      // return this.authService.giveAuthToGuard(urlS);

      //get Role Id
      // let userState = localStorage.getItem('Role');
      // get Path allowed
      // this.authService.getPathById(userState).subscribe(
      //   res=>{
      //      let pathAllowed = res.Data;
      //      this.pathArray = pathAllowed.map(ele=>ele.Url);
      //      console.log(this.pathArray);
      //      return this.checkUser(urlS);
      //     },
      //     error=>{
      //       return false
      //     }
      //     )
      // return this.checkUser(url);
      // console.log(this.authService.giveAuthToGuard(urlS));
      // //@ts-ignore;
      // return this.authService.giveAuthToGuard(urlS);
  }

  checkUser(url){
    console.log(this.pathArray,url)
    if (this.authService.giveAuthToGuard(url) == true){
      return true;
    }else{
    this.router.navigate(['/login'])
      return false
    }
  }
}


