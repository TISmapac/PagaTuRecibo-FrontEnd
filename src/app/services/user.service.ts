import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private URL_API = environment.apiUrl

  constructor(
    private http: HttpClient
  ) { }

  getUser(email: string){
    return this.http.get<Usuario>(this.URL_API+'usuarios/email/'+email);
  }

  createUser(user: Usuario){
    return this.http.post<any>(this.URL_API+'usuarios/', user);
  }

  updateUser(user: Usuario){
    return this.http.put<any>(this.URL_API+'usuarios/'+user.id, user);
  }
}
