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
//datos de suspension (agregado para mostrar en pago-movil)
  adeudaPadron: number = 0;
  reconexion: number = 0;
  adeudaReconexTotal: number = 0;
  flagReconexion: number = 0;

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
      // El parámetro llega formateado desde la app ("$123.45"). El importe
      // para mExpress debe ser numérico: si se envía con "$" (p. ej. al pagar
      // antes de que responda getContrato, o si éste falla), el banco lo
      // rechaza con "Campo importe inválido".
      this.monto        = Number(String(params.adeuda).replace(/[^0-9.]/g, '')) || 0;
      this.medidorP     = params.medidor;
      this.giroP        = params.giro;
      this.estatusP     = params.estatus;
      this.fechaVencP   = params.fechaVencimiento;
      this.fechaVencP   = this.fechaVencP.substring(8,10)+
                          '-'+this.fechaVencP.substring(5,7)+
                          '-'+this.fechaVencP.substring(0,4);

      this.referencia = this.generateReferencia(this.contratoP);
      this.getContrato(this.contratoP);

    });
    
    //this.getContrato(this.contratoP);
  }

  getContrato(contrato: number){

    console.log("entra");

    this.contratoService.getContrato(contrato).subscribe(res => {

    this.contrato = res;

    // Contrato activo
    if (res.adeuda) {
      this.monto = res.adeuda;
      this.adeudaP = '$' + Number(res.adeuda).toFixed(2);
    }

    // Contrato suspendido
    this.adeudaPadron = res.adeuda_padron || 0;
    this.reconexion = res.reconexion || 0;
    this.adeudaReconexTotal = res.adeuda_reconex_total || 0;
    this.flagReconexion = res.flag_reconexion || 0;

  });
  }

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
