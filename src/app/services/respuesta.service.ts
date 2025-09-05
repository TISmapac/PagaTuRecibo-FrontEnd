import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RespuestaService {

  constructor(
    private http: HttpClient
  ) { }

  getRespuesta() {

    //let headers = new Headers({ 'Content-Type': 'application/json' });
    //let options = new HttpRequest(headers);

    //return this.http.post('http://localhost:4200/respuesta', num, OptionsType)
  }
}
