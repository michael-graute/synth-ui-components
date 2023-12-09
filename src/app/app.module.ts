import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import { KnobComponent } from './knob/knob.component';
import { SliderComponent } from './slider/slider.component';
import { SwitchComponent } from './switch/switch.component';
import { AdsrEnvelopeComponent } from './adsr-envelope/adsr-envelope.component';
import { PanningKnobComponent } from './panning-knob/panning-knob.component';

@NgModule({
  declarations: [
    AppComponent,
    KnobComponent,
    SliderComponent,
    SwitchComponent,
    AdsrEnvelopeComponent,
    PanningKnobComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
