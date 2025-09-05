import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPagoComponent } from './card-pago.component';

describe('CardPagoComponent', () => {
  let component: CardPagoComponent;
  let fixture: ComponentFixture<CardPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
