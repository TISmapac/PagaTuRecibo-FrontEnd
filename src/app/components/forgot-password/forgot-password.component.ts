import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../../services/spinner.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  isLoading$ = this.spinnerService.isLoading$;

  isSubmitting = false;
  errorMessage = '';

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

    this.errorMessage = '';
    this.isSubmitting = true;

    this.authService.forgotPassword(this.user.email).subscribe(res => {

      this.isSubmitting = false;

      if (res.info == 'OK') {

        //redirect
        this.router.navigate(['/info-email']);

      }else{
        this.errorMessage = res;
      }

    }, err => {

      this.isSubmitting = false;

      if (err.error) {
        this.errorMessage = err.error.errors
          ? err.error.errors[0]['msg']
          : err.error.msg;
      }
    })
  }

}
