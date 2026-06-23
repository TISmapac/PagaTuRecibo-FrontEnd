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
    const token = this.getToken();
    if(!token){
      return false;
    }

    // Si el token es un JWT y está expirado, la sesión no es válida.
    // Si no se puede decodificar (token opaco), se mantiene el comportamiento previo
    // basado en la presencia del token para no bloquear al usuario.
    if(this.isTokenExpired(token)){
      this.logout();
      return false;
    }

    return true;
  }

  getToken(){
    return localStorage.getItem('token');
  }

  // Limpia toda la información de sesión almacenada.
  logout(){
    ['token', 'email', 'nombre', 'id', 'io-temp'].forEach(key => localStorage.removeItem(key));
  }

  // Decodifica el payload de un JWT de forma segura (base64url).
  private decodeToken(token: string): any | null {
    try {
      const payload = token.split('.')[1];
      if(!payload){
        return null;
      }
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  // true solo si el token es un JWT decodificable con un campo exp ya vencido.
  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if(!decoded || !decoded.exp){
      return false; // No es un JWT con expiración: no lo invalidamos aquí.
    }
    const expiresAtMs = decoded.exp * 1000;
    return Date.now() >= expiresAtMs;
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
