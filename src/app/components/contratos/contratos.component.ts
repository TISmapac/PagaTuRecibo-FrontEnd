import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContratoService } from '../../services/contrato.service';
import { Contrato } from '../../models/contrato';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.css']
})
export class ContratosComponent implements OnInit {

  @ViewChild('inputContrato') inputContrato!: ElementRef;

  user = {
    email: '',
    nombre: '',
    id: 0
  }

  contratos : any = [];
  contrato !: Contrato;
  nuevoContrato: number = 0; // Variable para el nuevo contrato a añadir
  showSuccessMessage: boolean = false;
  showDeleteMessage: boolean = false;
  showDuplicateMessage: boolean = false; // Nueva variable para contrato duplicado
  errorMessage: string = 'El contrato ya se encuentra vinculado a su cuenta'; // Mensaje de error específico


  constructor(
    private router: Router,
    private contratoService: ContratoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    
    /*this.route.params.subscribe(params => {
      //this.user.email = params.email
    });*/

    this.user.email = localStorage.getItem('email') || '';
    this.user.id = Number(localStorage.getItem('id') || 0); // Asumiendo que el ID está en localStorage

    this.getContratos();
  }

  getContratos(){

    this.contratoService.getContratosEmail(this.user.email).subscribe(res => {

      console.log(res);
      
      this.contratos = res

    })
  }

   // Implementar la función deleteContrato
 deleteContrato(contratoId: number){
    if(confirm('¿Estás seguro de que quieres eliminar este contrato?')) {
      this.contratoService.deleteContrato(contratoId, this.user.email).subscribe(
        (response: any) => {
          console.log('Contrato eliminado:', response);
          this.showDeleteMessage = true; // Mostrar mensaje de eliminación
          this.getContratos();
          
          // Ocultar el mensaje después de 3 segundos
          setTimeout(() => {
            this.showDeleteMessage = false;
          }, 3000);
        },
        (error) => {
          console.error('Error al eliminar contrato:', error);
          alert('Error al eliminar contrato: ' + error.error?.msg);
        }
      );
    }
  }

  viewContrato(contrato:number){
    this.router.navigate(['/dashboard/valida', {contrato: contrato}]);
  }

  findContrato(){

    let contrato = this.inputContrato.nativeElement.value;
    this.contratoService.getContrato(contrato).subscribe( res => {
      this.contrato = res;
    });
  }

  // Verificar si el contrato ya está en la lista del usuario
  checkIfContractAlreadyAdded(contratoNumber: number) {
    const alreadyAdded = this.contratos.some((c: any) => c.contrato === contratoNumber);
    if (alreadyAdded) {
      this.showDuplicateMessage = true;
      this.errorMessage = 'El número de contrato ya se encuentra vinculado a su cuenta';
      
      setTimeout(() => {
        this.showDuplicateMessage = false;
        this.errorMessage = '';
      }, 5000);
    }
  }


   // Implementar la función addContrato
    // Cambiar este método para que acepte un parámetro
  addContrato(contratoNumber: number){
    if (!this.user.id) {
      alert('Error: No se pudo identificar al usuario');
      return;
    }

     // Verificar si ya está añadido antes de hacer la petición
    const alreadyAdded = this.contratos.some((c: any) => c.contrato === contratoNumber);
    if (alreadyAdded) {
      this.showDuplicateMessage = true;
      this.errorMessage = 'El número de contrato ya se encuentra vinculado a su cuenta';
      
      setTimeout(() => {
        this.showDuplicateMessage = false;
        this.errorMessage = '';
      }, 5000);
      return;
    }


    console.log('Añadiendo contrato:', contratoNumber, 'para usuario:', this.user.id);

    this.contratoService.addContrato(this.user.id, contratoNumber).subscribe(
      (response: any) => {
        console.log('Contrato añadido:', response);
        this.showSuccessMessage = true;
        this.contrato = {} as Contrato; // Limpiar la búsqueda
        this.inputContrato.nativeElement.value = ''; // Limpiar el input
        this.getContratos(); // Actualizar la lista
        
        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      },
      (error) => {
        console.error('Error al añadir contrato:', error);
        // Manejar específicamente el error de contrato duplicado
        if (error.error?.msg && error.error.msg.includes('ya se encuentra vinculado')) {
          this.showDuplicateMessage = true;
          this.errorMessage = error.error.msg;
          
          setTimeout(() => {
            this.showDuplicateMessage = false;
            this.errorMessage = '';
          }, 5000);
        } else {
          alert('Error: ' + (error.error?.msg || 'No se pudo añadir el contrato'));
        }
      }
    );
  }

}
