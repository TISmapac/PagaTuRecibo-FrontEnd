import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoPasswordComponent } from './info-password.component';

describe('InfoPasswordComponent', () => {
  let component: InfoPasswordComponent;
  let fixture: ComponentFixture<InfoPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfoPasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
