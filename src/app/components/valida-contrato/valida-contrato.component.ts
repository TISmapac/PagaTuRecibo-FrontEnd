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
  monto_reconex !: number;
  idexpress = "2328";
  //idexpress = environment.idExpress;

  //mes -1 para que sea el exacto
  fechaVencimiento !: any;
  fechaSuspension !: String;
  vencido: boolean = false;
  puedePagar: boolean = false;

  infoMessage: String = "";

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

        this.puedePagar = this.calculaFechaSuspension(this.fechaSuspension);
      }

      this.contrato = res;
      this.infoMessage = '';

      this.referencia = this.generateReferencia(this.contrato?.contrato, this.contrato?.flag_reconexion);

      if (res.adeuda_reconex_total) {

        this.monto_reconex = res.adeuda_reconex_total;

      }

      if (this.contrato?.adeuda) {

        this.monto = res.adeuda;

        this.generateSignature(this.referencia, this.contrato?.adeuda).then(res => {

          this.signature = res;
        });

      }

      //Si existe reconexion
      if (this.contrato?.adeuda_reconex_total) {

        //Si existe Reconexion generamos signature de reconexion
        this.generateSignature(this.referencia, this.contrato?.adeuda_reconex_total).then(res => {

          this.signature = res;

        });

      }

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

  generateForm() {

    var form;
    let importe, referencia, signature, urlretorno, idexpress, financiamiento, plazos, mediospago;


    const uri = "https://www.adquiramexico.com.mx:443/mExpress/pago/avanzado";
    const retorno = 'https://restserver-smapac.herokuapp.com/api/orders/respuesta.html'

    form = document.createElement("form");
    form.method = "post";
    form.action = uri;

    //importe
    importe = document.createElement("input");
    importe.setAttribute("name", "importe");
    //importe.setAttribute("value", this.contrato?.adeuda);
    importe.setAttribute("value", "1");

    //referencia
    referencia = document.createElement("input");
    referencia.setAttribute("name", "referencia");
    referencia.setAttribute("value", this.referencia);

    //signature
    signature = document.createElement("input");
    signature.setAttribute("name", "signature");
    signature.setAttribute("value", this.signature);

    console.log(this.signature);

    //urlRetorno
    urlretorno = document.createElement("input");
    urlretorno.setAttribute("name", "urlretorno");
    urlretorno.setAttribute("type", "hidden");
    urlretorno.setAttribute("value", retorno);

    //idExpress
    idexpress = document.createElement("input");
    idexpress.setAttribute("name", "idexpress");
    idexpress.setAttribute("type", "hidden");
    idexpress.setAttribute("value", "2328");

    //financiamiento
    financiamiento = document.createElement("input");
    financiamiento.setAttribute("name", "financiamiento");
    financiamiento.setAttribute("type", "hidden");
    financiamiento.setAttribute("value", "");

    //plazos
    plazos = document.createElement("input");
    plazos.setAttribute("name", "plazos");
    plazos.setAttribute("type", "hidden");
    plazos.setAttribute("value", "");

    //mediospago
    mediospago = document.createElement("input");
    mediospago.setAttribute("name", "mediospago");
    mediospago.setAttribute("type", "hidden");
    mediospago.setAttribute("value", "110000");


    form.appendChild(importe);
    form.appendChild(referencia);
    form.appendChild(signature);
    form.appendChild(urlretorno);
    form.appendChild(idexpress);
    form.appendChild(financiamiento);
    form.appendChild(plazos);
    form.appendChild(mediospago);

    document.body.appendChild(form);
    form.submit();

  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  multipagos() {
    this.router.navigate(['/dashboard/multipagos']);
  }

  imprimeRecibo() {

    this.reciboService.downloadRecibo(this.contrato?.contrato);

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

  calculaFechaSuspension(fecha: String) {

    let dia, mes, anio;
    anio = fecha.substring(6, 10);
    mes = fecha.substring(3, 5);
    dia = fecha.substring(0, 2);

    console.log(fecha);

    fecha = anio + '-' + mes + '-' + dia

    let fecha_date = new Date(fecha.toString());
    let fecha_ingreso_admon = new Date('2021-11-02');
    let aux = false;

    if (fecha_date >= fecha_ingreso_admon) {

      console.log('puede pagar');
      console.log(fecha_date);
      aux = true
    } else {
      aux = false;
      console.log('no puede pagar');
      console.log(fecha_date);
    }

    return aux;
  }


}
