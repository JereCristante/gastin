import { LOCALE_ID,NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgChartsConfiguration, NgChartsModule } from 'ng2-charts';

import localeEs from  '@angular/common/locales/es-AR';

import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs,'es');
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, ReactiveFormsModule, NgChartsModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },{ provide: NgChartsConfiguration, useValue: { generateColors: false }},{provide:LOCALE_ID, useValue:'es'}],
  bootstrap: [AppComponent],
})
export class AppModule {}
