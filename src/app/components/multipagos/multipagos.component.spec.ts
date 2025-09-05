import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipagosComponent } from './multipagos.component';

describe('MultipagosComponent', () => {
  let component: MultipagosComponent;
  let fixture: ComponentFixture<MultipagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultipagosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
