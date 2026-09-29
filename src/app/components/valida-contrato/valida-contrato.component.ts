import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContratoService } from '../../services/contrato.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { UntypedFormControl, UntypedFormGroup, Validators, FormBuilder } from '@angular/forms';
import { RestService } from '../../services/rest.service';
import { SpinnerService } from '../../services/spinner.service';
import { LoadingService } from '../../services/loading.service';
import { ReciboService } from '../../services/recibo.service';
import { AuthService } from '../../services/auth.service';
import { Contrato } from '../../models/contrato';

@Component({
  selector: 'app-valida-contrato',
  templateUrl: './valida-contrato.component.html',
  styleUrls: ['./valida-contrato.component.css']
})
export class ValidaContratoComponent implements OnInit {


  createFormGroup() {
    return new UntypedFormGroup({
      name: new UntypedFormControl(['', [Validators.required]]),
      amount: new UntypedFormControl(['', [Validators.required, Validators.min(5)]])
    })
  }

  form: UntypedFormGroup;

  contratos: Contrato[] = [];
  contrato!: Contrato;
  periodo: any;
  referencia: any;
  signature: any;
  monto!: number;
  idexpress = "2328";
  //idexpress = environment.idExpress;

  //mes -1 para que sea el exacto
  fechaVencimiento !: any;
  fechaSuspension !: String;
  vencido: boolean = false;

  infoMessage: String = "";
  // Bloquea el botón de recibo mientras se genera (tarda unos segundos) para
  // evitar que el usuario dispare la solicitud dos veces.
  descargandoRecibo: boolean = false;


  user = {
    email: '',
    nombre: ''
  }

  isLoading$ = this.spinnerService.isLoading$;
  isLoadingReverse$ = this.spinnerService.isLoadingReverse$;
  isLoadingRecibo$ = this.spinnerService.isLoadingRecibo$;
  is$ = this.spinnerService.isLoadingPago$

  contratoParam !: number;
  contratoId: string = '';

  constructor(
    private contratoService: ContratoService,
    private userService: UserService,
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    public spinnerService: SpinnerService,
    public loadingService: LoadingService,
    private reciboService: ReciboService,
    private authService: AuthService
  ) {
    this.form = this.createFormGroup();

    this.form.setValue({
      amount: '',
      name: ''
    })
  }

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.contratoParam = params.contrato
    });

    if (!this.contratoParam) {

      this.route.params.subscribe(params => {

        this.user.email = params.email

      });

      this.getUser();

    } else {

      //Este es el camino cuando viene desde mis contratos
      this.contratoId = String(this.contratoParam);
      this.getContrato();
    }

  }

  getContratos() {
    
    this.contratoService.getContratos().subscribe(res => {

      this.contratos = res.contratos

    });
  }

  // Limpia el buscador y el resultado para consultar otro contrato.
  limpiar() {
    this.contratoId = '';
    this.contrato = {} as Contrato;
    this.infoMessage = '';
  }

  // Mantiene en el buscador solo dígitos y como máximo 6 (un número de contrato).
  onContratoInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const soloDigitos = input.value.replace(/\D/g, '').slice(0, 6);
    if (input.value !== soloDigitos) {
      input.value = soloDigitos;
    }
    this.contratoId = soloDigitos;
  }

  // Búsqueda manual: valida 6 dígitos antes de consultar.
  // (El camino desde "Mis contratos" llama a getContrato() directo, sin este gate.)
  buscarContrato() {
    if (!/^\d{6}$/.test(this.contratoId)) {
      this.infoMessage = 'El número de contrato debe tener exactamente 6 dígitos.';
      setTimeout(() => this.infoMessage = '', 5000);
      return;
    }
    this.getContrato();
  }

  getContrato() {

    let id = Number(this.contratoId);

    this.contratoService.getContrato(id).subscribe(res => {

      if (res.fecha_suspension) {
        this.fechaSuspension = this.formateaFechaSuspension(res.fecha_suspension.toString());
      }

      this.contrato = res;
      this.infoMessage = '';

      this.referencia = this.generateReferencia(this.contrato?.contrato, this.contrato?.flag_reconexion);

      if (this.contrato?.adeuda) {

        this.monto = res.adeuda;

        this.generateSignature(this.referencia, this.contrato?.adeuda).then(res => {

          this.signature = res;
        });

      }

      // NOTA: se eliminó la generación de monto/firma para "adeudo + reconexión".
      // Los contratos suspendidos NO pueden pagar en línea; deben acudir a
      // oficinas (regla reforzada también en el backend).

      if (this.contrato['msg']) {
        this.infoMessage = this.contrato['msg'];

      }

    })
  }

  generateReferencia(contrato: number, flag_reconex: number) {

    let fecha = new Date();

    let y = String(fecha.getFullYear());
    let m = ("0" + (fecha.getMonth() + 1)).slice(-2)
    let d = String(fecha.getDate());
    let h = ("0" + (fecha.getHours())).slice(-2)
    let mm = ("0" + (fecha.getMinutes())).slice(-2)
    let s = ("0" + (fecha.getSeconds())).slice(-2)
    let ms = ("0" + (fecha.getMilliseconds())).slice(-2)

    let cadena = 'REF_' + contrato + '_' + y + m + d + '-' + h + mm + s + ms;

    if (flag_reconex > 0) {
      cadena = 'RECONEX_' + contrato + '_' + y + m + d + '-' + h + mm + s + ms;
    }

    return cadena;

  }

  getUser() {

    //preguntamos si hay email en el localstorage

    if ((this.user.email == '') || (!this.user.email)) {

      this.user.email = localStorage.getItem('email') || '';
    }

    this.userService.getUser(this.user.email).subscribe(res => {
      this.user.nombre = res.nombre
    })

  }

  async generateSignature(referencia: string, importe: number) {

    //let key = '5tuJoT8BcTVlBbGzd-0x';  //ejemplo pdf
    let key = 'QvgGUjXOBnmRjc2CvHJ6'
    const idExpress = "2328";
    //let message = 'REF0011.001470'; 

    let message = referencia + importe + idExpress;
    let result;


    const getUtf8Bytes = (str: any) =>
      new Uint8Array(
        [...unescape(encodeURIComponent(str))].map(c => c.charCodeAt(0))
      );

    const keyBytes = getUtf8Bytes(key);
    const messageBytes = getUtf8Bytes(message);

    const cryptoKey = await crypto.subtle.importKey(
      'raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' },
      true, ['sign']
    );

    const sig = await crypto.subtle.sign('HMAC', cryptoKey, messageBytes);

    result = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');

    btoa(String.fromCharCode(...new Uint8Array(sig)));

    //console.log([...new Uint8Array(sig)].map(b => b.toString(16).padStart(2,'0')).join(''));

    this.signature = result;

    return result;

  }

  tocheckout(importe: number, contrato: number, nombre: string, email: string) {

    this.restService.generateOrder(contrato, importe, nombre, email).subscribe((data) => {

      this.router.navigate(['/dashboard/checkout', { localizator: data?.localizator, amount: importe, nombre: nombre, contrato: contrato }])
    })
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  multipagos() {
    this.router.navigate(['/dashboard/multipagos']);
  }

  imprimeRecibo() {

    // Evita la doble solicitud mientras el recibo se está generando.
    if (this.descargandoRecibo) {
      return;
    }

    this.descargandoRecibo = true;

    this.reciboService.downloadRecibo(this.contrato?.contrato).subscribe({
      next: (res) => {
        const file = new Blob([res], { type: 'application/pdf' });
        window.open(URL.createObjectURL(file));
        this.descargandoRecibo = false;
      },
      error: () => {
        // Si falla, se libera el botón para que pueda reintentar.
        this.descargandoRecibo = false;
        this.infoMessage = 'No fue posible descargar el recibo. Intente nuevamente.';
        setTimeout(() => this.infoMessage = '', 5000);
      }
    });

  }

  //Servicio al Playwright
  descargarRecibo() {

    this.reciboService.dRecibo(this.contrato?.contrato);

  }

  validaFecha() {

    let fechaHoy = new Date();
    let diaHoy = fechaHoy.getDay()
    let mes;

    mes = this.devuelveMes(fechaHoy.getMonth());

    if (diaHoy < 15) {

      mes = mes! - 1;
      this.fechaVencimiento = new Date(fechaHoy.getFullYear(), mes, 15);

    } else {
      this.fechaVencimiento = new Date(fechaHoy.getFullYear(), mes!, 15);
    }

    if (fechaHoy > this.fechaVencimiento) {
      this.vencido = false;
    } else {
      this.vencido = true;
    }

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }

    this.fechaVencimiento = this.fechaVencimiento.toLocaleString('es-MX', options);
    //this.fechaVencimiento = this.fechaVencimiento.getDate() +"/"+("0" + this.fechaVencimiento.getMonth()).slice(-2) +"/"+ this.fechaVencimiento.getFullYear();


  }

  devuelveMes(mes: number) {

    let aux;

    switch (mes) {
      case 0: aux = 1;
        break;

      case 1: aux = 2;
        break;

      case 2: aux = 3;
        break;

      case 3: aux = 4;
        break;

      case 4: aux = 5;
        break;

      case 5: aux = 6;
        break;

      case 6: aux = 7;
        break;

      case 7: aux = 8;
        break;

      case 8: aux = 9;
        break;

      case 9: aux = 10;
        break;

      case 10: aux = 11;
        break;

      case 11: aux = 12;
        break;

      default: 0;
    }

    return aux;
  }

  formateaFechaSuspension(fecha: String) {

    let dia, mes, anio;
    anio = fecha.substring(0, 4);
    mes = fecha.substring(7, 5);
    dia = fecha.substring(10, 8);

    fecha = dia + '/' + mes + '/' + anio

    return fecha;
  }

}
