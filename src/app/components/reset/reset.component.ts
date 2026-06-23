import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  form: UntypedFormGroup = new UntypedFormGroup({})

  errorMessage = '';

  private token='';

  constructor(
    private route: ActivatedRoute,
    private  fb: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)] ],
      password2: ['', [Validators.required, Validators.minLength(6)]] //TODO true | false
    })

    this.route.queryParams.subscribe(params =>{
      this.token = params.t;

      localStorage.setItem('io-temp',params.t);
    })
  }

  resetPassword(){

    this.errorMessage = '';

    if(!this.form.valid){
      this.errorMessage = 'Formulario inválido';
      return;
    }

    if(this.form.value.password !== this.form.value.password2){
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    //llamamos al service y enviamos el token como header
    this.authService.resetPassword(this.token, this.form.value.password).subscribe( res =>{

      if(res.message=="La contraseña ha sido cambiada"){
        this.router.navigate(['/password-success-changed'])
      }

    })
  }

}
