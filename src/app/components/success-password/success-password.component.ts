import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-password',
  templateUrl: './success-password.component.html',
  styleUrls: ['./success-password.component.css']
})
export class SuccessPasswordComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  toLogin(){
    this.router.navigate(['/login']);
  }

}
