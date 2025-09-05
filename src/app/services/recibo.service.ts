import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReciboService {

  URL_API= environment.apiUrl+'recibos/'

  constructor(
    private http: HttpClient
  ) { }

  downloadRecibo(contrato: number): any{
    return this.http.post(this.URL_API+contrato, {flag:1}, {responseType: 'blob'}).subscribe(res => {
        var file = new Blob([res], {type: 'application/pdf'});
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      });
  }

  dRecibo(contrato:number):any{
    return this.http.post(`${this.URL_API}browser/${contrato}`, {flag:1}, {responseType: 'blob'}).subscribe(res => {
      var file = new Blob([res], {type: 'application/pdf'});
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);

      console.log(res);
    });
  }
}
