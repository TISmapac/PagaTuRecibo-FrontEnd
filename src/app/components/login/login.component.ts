import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../services/spinner.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoading$ = this.spinnerService.isLoading$;

  isSubmitting = false;
  errorMessage = '';

  user = {
    email: '',
    password: ''
  }

  form: UntypedFormGroup = new UntypedFormGroup({})

  constructor(
    private authService: AuthService,
    public router: Router,
    private  fb: UntypedFormBuilder,
    private spinnerService: SpinnerService,
    private loadingService: LoadingService
    ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email] ],
      password: ['', [Validators.required, Validators.minLength(6)]] //TODO true | false
    })

  }

  onLoginUser() {

    this.errorMessage = '';

    if(!this.form.valid){
      this.errorMessage = 'Formulario inválido';
      return;
    }

    this.isSubmitting = true;

    //Eliminamos espacios en blanco que puedan darse en el email
    this.form.value.email = this.form.value.email.trim();

    this.authService.login(this.form.value).subscribe(res => {

      if(res.token){
        localStorage.setItem('token', res.token);
        localStorage.setItem('email', this.form.value.email);

        this.router.navigate(['/dashboard/valida', {email: this.form.value.email}]);
      } else if(res['msg']){
        this.errorMessage = res['msg'];
      }

      this.isSubmitting = false;

    }, err => {

      if(err.error){
        this.errorMessage = err.error.errors
          ? err.error.errors[0]['msg']
          : err.error.msg;
      }

      this.isSubmitting = false;

    })

  }

  loginGoogle(){
    console.log('Cupertino');
  }

}
