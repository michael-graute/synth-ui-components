import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import { KnobComponent } from './knob/knob.component';
import { SliderComponent } from './slider/slider.component';
import { SwitchComponent } from './switch/switch.component';
import { AdsrEnvelopeComponent } from './adsr-envelope/adsr-envelope.component';
import { PanningKnobComponent } from './panning-knob/panning-knob.component';
import { OscilloscopeComponent } from './oscilloscope/oscilloscope.component';
import { WaveformSelectComponent } from './waveform-select/waveform-select.component';
import { OscillatorComponent } from './oscillator/oscillator.component';
import {KeyboardComponent} from "./keyboard/keyboard.component";
import {FilterComponent} from "./filter/filter.component";
import {ButtonGroupComponent} from "./button-group/button-group.component";
//import { KnobRefactoredComponent } from './knob-refactored/knob-refactored.component';

@NgModule({
    declarations: [
        AppComponent,
        KnobComponent,
        SliderComponent,
        SwitchComponent,
        AdsrEnvelopeComponent,
        PanningKnobComponent,
        OscilloscopeComponent,
        WaveformSelectComponent,
        OscillatorComponent,
        KeyboardComponent,
        FilterComponent,
        //KnobRefactoredComponent
    ],
  imports: [
    BrowserModule,
    FormsModule,
    ButtonGroupComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
