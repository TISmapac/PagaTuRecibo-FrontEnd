import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UpdateNombreService } from '../../services/update-nombre.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user = {
    email: '',
    nombre: ''
  }

  constructor(
    private userService: UserService,
    public updateNombreService: UpdateNombreService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getUser();
  }

  logOut(){
    this.authService.logout();
    location.reload();
    this.router.navigate(['/']);
  }

  getUser(){

    //preguntamos si hay email en el localstorage

    if ((this.user.email == '') || (!this.user.email)) {

      this.user.email = localStorage.getItem('email') || '';
    }

    this.userService.getUser(this.user.email).subscribe(res => {

      this.user.nombre = res.nombre

      this.updateNombreService.nombreUsuario = res.nombre;

      if(this.user.nombre){
        localStorage.setItem('nombre', res.nombre);
        localStorage.setItem('id', res.id);
      }
    })
  }

}
