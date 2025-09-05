import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpParamsOptions } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private URL_API = environment.apiUrl;

  private URL_CLIENT = environment.clientUrl;

  constructor(
    private http: HttpClient
  ) { }

  createResetHeader(headers: Headers, token: string){
    headers.append('reset', token)
  }

  login(user: any){
    return this.http.post<any>(this.URL_API+'auth/login', user);
  }

  loggedIn(){
    return !!(localStorage.getItem('token'));
  }

  getToken(){
    return localStorage.getItem('token');
  }

  forgotPassword(email: string){
    return this.http.put<any>(this.URL_API+'auth/forgot-password',{email});
  }

  resetPassword(token:string, password: string){

    const params = {
      newPassword : password
    }


    return this.http.put<any>(this.URL_API+'auth/new-password', params)
  }


}
