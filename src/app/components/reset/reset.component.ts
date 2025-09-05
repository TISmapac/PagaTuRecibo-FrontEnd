import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare var $: any;

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  form: FormGroup = new FormGroup({})

  private token='';

  constructor(
    private route: ActivatedRoute,
    private  fb: FormBuilder,
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


    if(this.form.valid){

      console.log(this.form.value);

      if(this.form.value.password == this.form.value.password2){
        console.log("Estas dentro");

        //llamamos al service y enviamos el token como header

        this.authService.resetPassword(this.token, this.form.value.password).subscribe( res =>{
          
          if(res.message=="La contraseña ha sido cambiada"){

            this.router.navigate(['/password-success-changed'])
            
          }
          
        })

      }else{

        $("#errorMessage").text('Las contraseñas no coinciden');
      }
    }else{
      $("#errorMessage").text('Formulario invalido');
    }
  }

}
