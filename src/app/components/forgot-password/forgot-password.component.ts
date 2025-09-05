import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner.service';

declare var $: any;

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  isLoading$ = this.spinnerService.isLoading$;

  user = {
    email: ''
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
  }

  resetPassword() {

    let error=''

    $('#btnForgot').attr('disabled',true);


    this.authService.forgotPassword(this.user.email).subscribe(res => {

      $('#btnForgot').attr('disabled',false);

      if (res.info == 'OK') {

        //redirect
        this.router.navigate(['/info-email']);

      }else{
        $('#errorMessage').text(res)
      }

    }, err => {


      if (err.error) {
        error = err.error.msg;

        if (err.error.errors) {
          error = err.error.errors[0]['msg'];
        }

        $('#errorMessage').text(error)
      }
    })
  }

}
