
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  isLoading$ = new Subject<boolean>();
  isLoadingReverse$ = new Subject<boolean>();

  isLoadingRecibo$ = new Subject<boolean>();
  isLoadingName$ = new Subject<boolean>();

  isLoadingPago$ = new Subject<boolean>();

  isLoadingCheckout$ = new Subject<boolean>();

  constructor() { }

  show(): void {

    this.isLoading$.next(true);
    this.isLoadingReverse$.next(false);
    this.isLoadingPago$.next(true);
  }

  hide(): void {

    this.isLoading$.next(false);
    this.isLoadingReverse$.next(true);
  }

  showPago(): void{
    this.isLoadingPago$.next(true);
  }

  hidePago(): void{
    this.isLoadingPago$.next(false);
  }

  showCheckoutPago(): void{
    this.isLoadingCheckout$.next(true);
  }

  hideCheckoutPago(): void{
    this.isLoadingCheckout$.next(false);
  }

  showRecibo(): void{
    this.isLoadingRecibo$.next(true);
  }

  hideRecibo():void{
    this.isLoadingRecibo$.next(false);
  }

  showName():void{
    this.isLoadingName$.next(true);
  }

  hideName():void{
    this.isLoadingName$.next(false);
  }

}



