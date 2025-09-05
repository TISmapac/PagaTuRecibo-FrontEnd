import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { ResContrato, Contrato } from '../models/contrato';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  private URL_API = environment.apiUrl

  constructor(
    private http: HttpClient
  ) { }

  getContratos(){
    return this.http.get<ResContrato>(this.URL_API+'contratos/');
  }

  getContrato( id:number ){
    return this.http.get<Contrato>(this.URL_API+'contratos/'+id);
  }

  getPeriodo(){
    return this.http.get<any>(this.URL_API+'periodos/');
  }

  getContratosByUser( email:string ){
    return this.http.get<any>(this.URL_API+'contratos/consulta/'+email);
  }

  getContratosEmail( email:string ){
    return this.http.get<any>(this.URL_API+'contratos/test/'+email);
  }

 // Cambiar definitivamente el método addContrato para que acepte número
addContrato(userId: number, contratoNumber: number) {
  return this.http.post(this.URL_API + 'contratos/add/' + userId, { 
    contrato: contratoNumber 
  });
}

   // Agregar método para eliminar contrato
  deleteContrato(id:number, email:string){
    return this.http.delete(this.URL_API+'contratos/delete/'+id, {
      body: { email: email }
    });
  }
  
}
