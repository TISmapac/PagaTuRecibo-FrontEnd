import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Route } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ValidaContratoComponent } from './components/valida-contrato/valida-contrato.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { CheckoutComponent } from './components/checkout/checkout.component';

import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { InfoPasswordComponent } from './components/info-password/info-password.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { interceptorProviders } from './interceptors'
import { ResetComponent } from './components/reset/reset.component';
import { SuccessPasswordComponent } from './components/success-password/success-password.component';
import { MultipagosComponent } from './components/multipagos/multipagos.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CardPagoComponent } from './components/card-pago/card-pago.component';
import { ContratosComponent } from './components/contratos/contratos.component';
import { ContratoComponent } from './components/contrato/contrato.component';
import { FooterComponent } from './components/footer/footer.component';


const routes: Route[] = [

  /*{ path: '', component: LoginComponent },*/
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: '', component: HomeComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'info-email', component: InfoPasswordComponent },
      { path: 'reset', component: ResetComponent },
      { path: 'password-success-changed', component: SuccessPasswordComponent },
      { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
      { path: 'valida', component: ValidaContratoComponent, canActivate: [AuthGuard] },
      { path: 'thankyou', component: ThankyouComponent, canActivate: [AuthGuard] },
      { path: 'pago-movil', component: CardPagoComponent},
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard],
        children: [
          { path: 'valida', component: ValidaContratoComponent, canActivate: [AuthGuard] },
          { path: 'contratos', component: ContratosComponent, canActivate: [AuthGuard] },
          { path: 'contrato', component: ContratoComponent, canActivate: [AuthGuard] },
          { path: 'multipagos', component: MultipagosComponent, canActivate: [AuthGuard] },
          { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
          { path: 'myProfile', component: ProfileComponent, canActivate: [AuthGuard] },
        ]
      }
    ]
  },

]


@NgModule({
  declarations: [
    AppComponent,
    ValidaContratoComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    CheckoutComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    InfoPasswordComponent,
    ThankyouComponent,
    DashboardComponent,
    ResetComponent,
    SuccessPasswordComponent,
    MultipagosComponent,
    ProfileComponent,
    CardPagoComponent,
    ContratosComponent,
    ContratoComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes, { useHash: true }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
    timeOut: 6000,
    positionClass: 'toast-top-center',
    preventDuplicates: true
  }),
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    AuthService,
    AuthGuard,
      interceptorProviders,

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
