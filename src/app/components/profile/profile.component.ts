import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UpdateNombreService } from '../../services/update-nombre.service';
import { SpinnerService } from '../../services/spinner.service';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user = {
    uid: '',
    nombre: '',
    email: ''
  }

  userForm: FormGroup;

  isLoadingName$ = this.spinnerService.isLoadingName$;
  //isLoadingRecibo$ = this.spinnerService.isLoadingRecibo$;

  constructor(
    private userService: UserService,
    public updateNombreService: UpdateNombreService,
    private spinnerService: SpinnerService,
    builder: FormBuilder
  ) {
    this.userForm = builder.group({
      id: [''],
      nombre: ['', [Validators.required]],
      email: ['']
    })

    this.userForm.setValue({
      id: localStorage.getItem('id') || '',
      nombre: '',
      email: localStorage.getItem('email') || ''
    })
  }

  ngOnInit(): void {

    this.getUser();

    $('#inputNombre').hide();
    $('#btnSave').hide();
    $('#btnCancel').hide();


    $('#inputNombre').keyup(() => {

      let inputNombre = $('#inputNombre').val();


      if (inputNombre != this.user.nombre) {
        $('#btnSave').attr('disabled', false);
      } else {
        $('#btnSave').attr('disabled', true);
      }

    });

  }

  getUser() {
    if ((this.user.email == '') || (!this.user.email)) {

      this.user.uid = localStorage.getItem('uid') || '';
      this.user.email = localStorage.getItem('email') || '';
      this.user.nombre = localStorage.getItem('nombre') || '';

    }

  }

  editUser() {

    $('#inputNombre').val(this.updateNombreService.nombreUsuario)
    $('#inputNombre').show();

    $('#btnEdit').hide();
    $('#nombreRes').hide();

    $('#btnSave').show();
    $('#btnCancel').show();
    $('#btnSave').attr('disabled', true);


  }

  updateUser() {

    this.userService.updateUser(this.userForm.value).subscribe(res => {
      console.log(res);
      if (res.msg) {
        this.updateNombreService.nombreUsuario = this.userForm.value.nombre;

        $('#nombreRes').show();
        $('#btnEdit').show();

        $('#inputNombre').hide();
        $('#btnSave').hide();
        $('#btnCancel').hide();
      }
    })


  }

  cancel() {
    $('#btnSave').hide();
    $('#btnCancel').hide();
    $('#inputNombre').hide();

    $('#btnEdit').show();
    $('#nombreRes').show();
  }

}
