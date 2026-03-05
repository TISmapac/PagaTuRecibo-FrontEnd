import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, NgForm } from '@angular/forms';

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
    private fb: UntypedFormBuilder
  ) { }

  ngOnInit(): void {
  }

  onSubmit(f: NgForm){

  }


}
