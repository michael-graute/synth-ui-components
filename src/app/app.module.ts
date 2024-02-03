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
import { KeyboardComponent} from "./keyboard/keyboard.component";
import { FilterComponent } from "./filter/filter.component";
import { ButtonGroupComponent } from "./button-group/button-group.component";
import { AbstractInputComponent } from "./abstracts/abstract-input.component";
import { SequencerComponent} from "./sequencer/sequencer.component";
import { SequencerStepComponent} from "./sequencer/sequencer-step/sequencer-step.component";
import { WaveformPlotterComponent} from "./waveform-plotter/waveform-plotter.component";
import { DividerComponent } from "./divider/divider.component";
import { LfoComponent } from "./lfo/lfo.component";
import { MidiMonitorComponent } from "./midi-manager/midi-monitor/midi-monitor.component";
import { AbstractSynthComponent } from "./abstracts/abstract-synth.component";
import {DelayComponent} from "./delay/delay.component";
import {ReverbComponent} from "./reverb/reverb.component";
import {PresetManagerComponent} from "./preset-manager/preset-manager.component";
import {UndoManagerComponent} from "./undo-manager/undo-manager.component";
import {ElementsShowcaseComponent} from "./elements-showcase/elements-showcase.component";
import {MidiOverlayComponent} from "./midi-manager/midi-overlay/midi-overlay.component";

@NgModule({
  declarations: [
    AppComponent,
    AbstractInputComponent,
    AbstractSynthComponent,
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
    SequencerComponent,
    SequencerStepComponent,
    WaveformPlotterComponent,
    DividerComponent,
    LfoComponent,
    MidiMonitorComponent,
    DelayComponent,
    ReverbComponent,
    PresetManagerComponent,
    UndoManagerComponent,
    ElementsShowcaseComponent,
    MidiOverlayComponent
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
