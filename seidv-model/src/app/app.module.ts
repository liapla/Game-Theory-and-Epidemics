import { NgModule } from '@angular/core';; 
import { FormsModule } from '@angular/forms'; 
import { MatSliderModule } from '@angular/material/slider'; 
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ImpressumComponent } from './impressum/impressum.component';
import { DatenschutzComponent } from './datenschutz/datenschutz.component';
import { RouterModule, Routes } from '@angular/router'

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyCMjEcH-zZMkTgx1oIZFJMencO4rnpviog",

  authDomain: "seidv-model.firebaseapp.com",

  projectId: "seidv-model",

  storageBucket: "seidv-model.appspot.com",

  messagingSenderId: "1015862795411",

  appId: "1:1015862795411:web:24c126128b22c4a2ea4166"

};


// Initialize Firebase

const app = initializeApp(firebaseConfig);

const routes: Routes = [
  { path: 'home', component: LineChartComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: 'datenschutz', component: DatenschutzComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    ImpressumComponent,
    DatenschutzComponent
  ],
  imports: [
    BrowserModule,
    MatSliderModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxSliderModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
