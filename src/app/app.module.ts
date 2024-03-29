import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import { KnobComponent } from './ui-elements/knob/knob.component';
import { SliderComponent } from './ui-elements/slider/slider.component';
import { SwitchComponent } from './switch/switch.component';
import { AdsrEnvelopeComponent } from './adsr-envelope/adsr-envelope.component';
import { PanningKnobComponent } from './panning-knob/panning-knob.component';
import { OscilloscopeComponent } from './oscilloscope/oscilloscope.component';
import { WaveformSelectComponent } from './waveform-select/waveform-select.component';
import { SimpleSynthComponent } from './instruments/simple-synth/simple-synth.component';
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
import {FeedbackDelayComponent} from "./effects/feedback-delay/feedback-delay.component";
import {ReverbComponent} from "./effects/reverb/reverb.component";
import {PresetManagerComponent} from "./preset-manager/preset-manager.component";
import {UndoManagerComponent} from "./undo-manager/undo-manager.component";
import {ElementsShowcaseComponent} from "./elements-showcase/elements-showcase.component";
import {MidiOverlayComponent} from "./midi-manager/midi-overlay/midi-overlay.component";
import {KnobMidiComponent} from "./knob-midi/knob-midi.component";
import {DuoSynthComponent} from "./instruments/duo-synth/duo-synth.component";
import {AmSynthComponent} from "./instruments/am-synth/am-synth.component";
import {FmSynthComponent} from "./instruments/fm-synth/fm-synth.component";
import {MonoSynthComponent} from "./instruments/mono-synth/mono-synth.component";
import {ChorusComponent} from "./effects/chorus/chorus.component";
import {TremoloComponent} from "./effects/tremolo/tremolo.component";
import {VibratoComponent} from "./effects/vibrato/vibrato.component";
import {PhaserComponent} from "./effects/phaser/phaser.component";
import {DistortionComponent} from "./effects/distortion/distortion.component";
import {AutoWahComponent} from "./effects/auto-wah/auto-wah.component";
import {BitCrusherComponent} from "./effects/bit-crusher/bit-crusher.component";
import {ChebyshevComponent} from "./effects/chebyshev/chebyshev.component";
import {AutoFilterComponent} from "./effects/auto-filter/auto-filter.component";
import {MetalSynthComponent} from "./instruments/metal-synth/metal-synth.component";
import {MembraneSynthComponent} from "./instruments/membrane-synth/membrane-synth.component";
import {PluckSynthComponent} from "./instruments/pluck-synth/pluck-synth.component";
import {NoiseSynthComponent} from "./instruments/noise-synth/noise-synth.component";
import {SamplerComponent} from "./instruments/sampler/sampler.component";
import {PianoRollComponent} from "./piano-roll/piano-roll.component";
// import {LongPressDirective} from "./long-press.directive";
import {HorizontalRangeSliderComponent} from "./ui-elements/horizontal-range-slider/horizontal-range-slider.component";

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
    SimpleSynthComponent,
    KeyboardComponent,
    FilterComponent,
    SequencerComponent,
    SequencerStepComponent,
    WaveformPlotterComponent,
    DividerComponent,
    LfoComponent,
    MidiMonitorComponent,
    FeedbackDelayComponent,
    ReverbComponent,
    PresetManagerComponent,
    UndoManagerComponent,
    ElementsShowcaseComponent,
    MidiOverlayComponent,
    KnobMidiComponent,
    DuoSynthComponent,
    AmSynthComponent,
    FmSynthComponent,
    MonoSynthComponent,
    ChorusComponent,
    TremoloComponent,
    VibratoComponent,
    PhaserComponent,
    DistortionComponent,
    AutoWahComponent,
    BitCrusherComponent,
    ChebyshevComponent,
    AutoFilterComponent,
    MetalSynthComponent,
    MembraneSynthComponent,
    PluckSynthComponent,
    NoiseSynthComponent,
    SamplerComponent,
    PianoRollComponent,
    //LongPressDirective,
    HorizontalRangeSliderComponent
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
