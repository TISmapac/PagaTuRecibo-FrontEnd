import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { HttpRequest, HttpErrorResponse, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { SpinnerService } from './spinner.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(
    private authSvc: AuthService,
    private spinnerService: SpinnerService,
    private loadingService: LoadingService,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    if(req.body?.token){
      this.spinnerService.showCheckoutPago();
    }

    //Esta condicion muestra el spinner del login
    if(req.body?.password || req.body?.email){
      this.spinnerService.show();
    }

    let tokenReset = localStorage.getItem('io-temp');

    if(!tokenReset){
      tokenReset = '1234'
    }

    const tokenizeReq = req.clone({
      setHeaders: {
        Authorization: `${this.authSvc.getToken()}`,
        'x-token': `${this.authSvc.getToken()}`,
        'reset': `${tokenReset}`
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
