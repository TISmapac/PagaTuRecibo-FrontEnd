import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authSvc: AuthService,
    private router: Router
  ){}

  canActivate():boolean{
    if(this.authSvc.loggedIn()){
      return true;
    }

    this.router.navigate(['/']);
    return false
  }
  
}
