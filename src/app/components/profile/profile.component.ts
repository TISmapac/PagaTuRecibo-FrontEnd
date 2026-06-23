import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { UpdateNombreService } from '../../services/update-nombre.service';
import { SpinnerService } from '../../services/spinner.service';

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

  userForm: UntypedFormGroup;

  editing = false;

  isLoadingName$ = this.spinnerService.isLoadingName$;
  //isLoadingRecibo$ = this.spinnerService.isLoadingRecibo$;

  constructor(
    private userService: UserService,
    public updateNombreService: UpdateNombreService,
    private spinnerService: SpinnerService,
    builder: UntypedFormBuilder
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
  }

  // El botón Guardar se habilita solo cuando el nombre cambió y no está vacío.
  get isSaveDisabled(): boolean {
    const nombre = (this.userForm.value.nombre || '').trim();
    return !nombre || nombre === this.updateNombreService.nombreUsuario;
  }

  getUser() {
    if ((this.user.email == '') || (!this.user.email)) {

      this.user.uid = localStorage.getItem('uid') || '';
      this.user.email = localStorage.getItem('email') || '';
      this.user.nombre = localStorage.getItem('nombre') || '';

    }

  }

  editUser() {
    // Precargamos el input con el nombre actual y entramos en modo edición.
    this.userForm.patchValue({ nombre: this.updateNombreService.nombreUsuario });
    this.editing = true;
  }

  updateUser() {

    this.userService.updateUser(this.userForm.value).subscribe(res => {
      if (res.msg) {
        this.updateNombreService.nombreUsuario = this.userForm.value.nombre;
        this.editing = false;
      }
    })

  }

  cancel() {
    this.editing = false;
  }

}
