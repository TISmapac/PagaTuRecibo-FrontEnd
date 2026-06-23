import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  // Sitio web oficial (portal institucional) al que se puede regresar.
  readonly sitioOficial = 'https://smapac.gob.mx';

}
