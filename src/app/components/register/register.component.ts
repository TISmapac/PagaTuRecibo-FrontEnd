import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SpinnerService } from '../../services/spinner.service';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  isLoading$ = this.spinnerService.isLoading$;

  user = {
    id: '',
    nombre: '',
    email: '',
    password: ''
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
  }

  onRegisterUser() {

    //Validar contraseña
    let a, b, messageError;

    a = $('#password').val();
    b = $('#passAux').val();

    if (a == b) {

      $('#btnRegister').attr('disabled',true);

      this.userService.createUser(this.user).subscribe(res => {

        //alert(res['msg']+'. Por favor inicie sesión');

        this.authService.login(this.user).subscribe(res => {

          

          localStorage.setItem('token', res.token);
          localStorage.setItem('email', this.user.email);

          this.router.navigate(['/dashboard/valida', { email: this.user.email }]);

        })



      }, err => {
        if (err.error) {

          messageError = err.error.errors[0]['msg'];
          $('#errorMessage').text(messageError);

          $("#btnRegister").removeAttr('disabled');
        }
      });

    } else {
      messageError = 'Las contraseñas no coinciden'
      $('#errorMessage').text(messageError);
    }


  }

}
