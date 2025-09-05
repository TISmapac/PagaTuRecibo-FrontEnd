import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { SpinnerService } from './spinner.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingService implements HttpInterceptor{

  isLoading$ = new Subject<boolean>();
  isLoadingReverse$ = new Subject<boolean>();

  constructor(
    private spinnerService: SpinnerService
  ) { }

  /*show(): void {
    console.log("Se ejecuta desde el loading Service");
    this.isLoading$.next(true);
    this.isLoadingReverse$.next(false);
  }

  hide(): void {
    console.log("Termina de ejecutarse desde el loading service");
    this.isLoading$.next(false);
    this.isLoadingReverse$.next(true);
  }*/

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    //Esta condición activa el spinner del button validar contratos unicamente
    if(!req.body){
      this.spinnerService.show();

    }else{
      this.spinnerService.showPago();
    }

    if(req.body?.flag){
      this.spinnerService.showRecibo();
    }

    if(req.body?.nombre){
      this.spinnerService.showName();
    }
    
    //this.show();

    return next.handle(req).pipe(
        finalize(() => {
          this.spinnerService.hide()
          this.spinnerService.hideRecibo();
          this.spinnerService.hideName();
          //this.hide();
        }));
}
}
