import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {jqxSliderModule} from "jqwidgets-ng/jqxslider";
import {FormsModule} from "@angular/forms";
import {jqxKnobModule} from "jqwidgets-ng/jqxknob";
import {jqxNumberInputModule} from "jqwidgets-ng/jqxnumberinput";
import {jqxDrawModule} from "jqwidgets-ng/jqxdraw";
import { KnobComponent } from './knob/knob.component';
import { SliderComponent } from './slider/slider.component';

@NgModule({
  declarations: [
    AppComponent,
    KnobComponent,
    SliderComponent
  ],
  imports: [
    BrowserModule,
    jqxSliderModule,
    FormsModule,
    jqxKnobModule,
    jqxNumberInputModule,
    jqxDrawModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
