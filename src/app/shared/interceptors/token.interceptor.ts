import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from "rxjs/operators";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor{

    constructor(
        private authSvc: AuthService,
        private router: Router
        ){}
    
    intercept(req: HttpRequest<any>, next: HttpHandler) {

    
        const tokenizeReq = req.clone({
          setHeaders: {
            Authorization: `${this.authSvc.getToken()}`,
            'x-token': `${this.authSvc.getToken()}`
          }
        })
    
        return next.handle(tokenizeReq).pipe(
          catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
              this.router.navigateByUrl('/');
            }
    
    
            return throwError(err);
          })
        )
      }
}