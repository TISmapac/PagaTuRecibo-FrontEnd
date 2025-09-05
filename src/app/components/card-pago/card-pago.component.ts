import { Component, OnInit } from '@angular/core';
import { ContratoService } from '../../services/contrato.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card-pago',
  templateUrl: './card-pago.component.html',
  styleUrls: ['./card-pago.component.css']
})
export class CardPagoComponent implements OnInit {

  contrato    :   any;
  referencia  :   String = '';
  signature   :   String = '';
  monto       :   number = 0;

  //Params
  emailP      :   String = '';
  contratoP   :   number = 0;
  nombreP     :   String = '';
  adeudaP     :   String = '';
  direccionP  :   String = '';
  coloniaP    :   String = '';
  medidorP    :   String = '';
  giroP       :   String = '';
  estatusP    :   String = '';
  fechaVencP  :   String = '';


  constructor(
    private route: ActivatedRoute,
    private contratoService: ContratoService
  ) { }

  ngOnInit(): void {

    //Aqui recibo el contrato como parametro
    this.route.params.subscribe(params => {

      this.contratoP    = params.contrato;
      this.nombreP      = params.nombre;
      this.nombreP      = this.nombreP.toUpperCase();
      this.direccionP   = params.direccion;
      this.coloniaP     = params.colonia;
      this.adeudaP      = params.adeuda;
      this.monto      = params.adeuda;
      this.medidorP     = params.medidor;
      this.giroP        = params.giro;
      this.estatusP     = params.estatus;
      this.fechaVencP   = params.fechaVencimiento;
      this.fechaVencP   = this.fechaVencP.substring(8,10)+
                          '-'+this.fechaVencP.substring(5,7)+
                          '-'+this.fechaVencP.substring(0,4);

      this.referencia = this.generateReferencia(this.contratoP);
      this.monto = params.adeuda.replace('$','');

    });
    
    //this.getContrato(this.contratoP);
  }

  /*getContrato(contrato: number){

    console.log("entra");

    this.contratoService.getContrato(contrato).subscribe( res => {

      this.monto = res.adeuda;
      //this.contrato = res;
      //this.referencia = this.generateReferencia(contrato);

    });
  }*/

  generateReferencia(contrato : number){

    let fecha = new Date();

    let y = String(fecha.getFullYear());
    let m = ("0" + (fecha.getMonth() + 1)).slice(-2)
    let d = String(fecha.getDate());
    let h = ("0" + (fecha.getHours())).slice(-2)
    let mm = ("0" + (fecha.getMinutes())).slice(-2)
    let s = ("0" + (fecha.getSeconds())).slice(-2)
    let ms = ("0" + (fecha.getMilliseconds())).slice(-2)

    let cadena = 'REF_' + contrato + '_' + y + m + d + '-' + h + mm + s + ms;

    return cadena;
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

}
