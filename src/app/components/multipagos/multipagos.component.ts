import { Component, OnInit } from '@angular/core';
import { FormBuilder, NgForm } from '@angular/forms';

@Component({
  selector: 'app-multipagos',
  templateUrl: './multipagos.component.html',
  styleUrls: ['./multipagos.component.css']
})
export class MultipagosComponent implements OnInit {

  checkoutForm = this.fb.group({
    name: '',
    address: ''
  })

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm){

  }


}
