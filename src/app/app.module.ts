import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {FormsModule} from "@angular/forms";
import { KnobComponent } from './ui-elements/knob/knob.component';
import { SliderComponent } from './ui-elements/slider/slider.component';
import { SwitchComponent } from './ui-elements/switch/switch.component';
import { AdsrEnvelopeComponent } from './ui-elements/adsr-envelope/adsr-envelope.component';
import { OscilloscopeComponent } from './components/oscilloscope/oscilloscope.component';
import { WaveformSelectComponent } from './ui-elements/waveform-select/waveform-select.component';
import { SimpleSynthComponent } from './instruments/simple-synth/simple-synth.component';
import { KeyboardComponent} from "./components/keyboard/keyboard.component";
import { ButtonGroupComponent } from "./ui-elements/button-group/button-group.component";
import { AbstractInputComponent } from "./abstracts/abstract-input.component";
import { SequencerComponent} from "./components/sequencer/sequencer.component";
import { SequencerStepComponent} from "./components/sequencer/sequencer-step/sequencer-step.component";
import { WaveformPlotterComponent} from "./components/waveform-plotter/waveform-plotter.component";
import { DividerComponent } from "./ui-elements/divider/divider.component";
import { LfoComponent } from "./lfo/lfo.component";
import { MidiMonitorComponent } from "./managers/midi-manager/midi-monitor/midi-monitor.component";
import { AbstractSynthComponent } from "./abstracts/abstract-synth.component";
import {FeedbackDelayComponent} from "./effects/feedback-delay/feedback-delay.component";
import {ReverbComponent} from "./effects/reverb/reverb.component";
import {PresetManagerComponent} from "./managers/preset-manager/preset-manager.component";
import {UndoManagerComponent} from "./managers/undo-manager/undo-manager.component";
import {ElementsShowcaseComponent} from "./components/elements-showcase/elements-showcase.component";
import {MidiOverlayComponent} from "./managers/midi-manager/midi-overlay/midi-overlay.component";
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
import {PianoRollComponent} from "./components/piano-roll/piano-roll.component";
import {HorizontalRangeSliderComponent} from "./ui-elements/horizontal-range-slider/horizontal-range-slider.component";
import {SelectComponent} from "./ui-elements/select/select.component";
import {ScaleBuilderComponent} from "./components/scale-builder/scale-builder.component";

@NgModule({
  declarations: [
    AppComponent,
    AbstractInputComponent,
    AbstractSynthComponent,
    KnobComponent,
    SliderComponent,
    SwitchComponent,
    AdsrEnvelopeComponent,
    OscilloscopeComponent,
    WaveformSelectComponent,
    SimpleSynthComponent,
    KeyboardComponent,
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
    HorizontalRangeSliderComponent,
    SelectComponent,
    ScaleBuilderComponent
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
