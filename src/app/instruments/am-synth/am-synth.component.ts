import {Component, Input} from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from "tone";
import {ADSREnvelopeConfig, OscillatorConfig} from "../../types/config.types";

export type AmSynthConfig = {
  volume: number;
  active: boolean;
  octave: number;
  harmonicity: number;
  portamento: number;
  detune: number;
  oscillator: OscillatorConfig;
  envelope: ADSREnvelopeConfig;
  modulation: OscillatorConfig;
  modulationEnvelope: ADSREnvelopeConfig;
}

@Component({
  selector: 'ins-am-synth',
  templateUrl: './am-synth.component.html',
  styleUrl: './am-synth.component.scss'
})
export class AmSynthComponent extends AbstractSynthComponent<AmSynthConfig> {

  @Input() name: string = 'AmSynth';
  @Input() polyphonic: boolean = true;

  protected override componentType: string = 'instrument';
  protected override instrument: Tone.PolySynth | Tone.AMSynth = new Tone.PolySynth(Tone.AMSynth);
  override config: AmSynthConfig = {
    volume: -15,
    active: true,
    octave: 0,
    harmonicity: 1,
    portamento: 0,
    detune: 0,
    oscillator: {
      type: 'sine',
      detune: 0,
      active: true,
      volume: -15,
      octave: 0
    },
    envelope: {
      attack: 0.01,
      decay: 0.1,
      sustain: 0.5,
      release: 1,
    },
    modulation: {
      type: 'sine',
      detune: 0,
      active: true,
      volume: -15,
      octave: 0
    },
    modulationEnvelope: {
      attack: 0.5,
      decay: 0,
      sustain: 1,
      release: 0.5
    }
  }

  override ngOnInit() {
    if(this.polyphonic) {
      this.instrument = new Tone.PolySynth(Tone.AMSynth);
    } else {
      this.instrument = new Tone.AMSynth();
    }
    super.ngOnInit();
  }

  set active(value: boolean) {
    this.config.active = value;
  }

  get active(): boolean {
    return this.config.active;
  }

  set type(type: any) {
    this.instrument.set({oscillator: {type: type}});
    this.config.oscillator.type = type;
  }
  get type(): any {
    return this.config.oscillator.type;
  }

  set modulationType(type: any) {
    this.instrument.set({modulation: {type: type}});
    this.config.modulation.type = type;
  }
  get modulationType(): any {
    return this.config.modulation.type;
  }

  set harmonicity(value: number) {
    this.instrument.set({harmonicity: value});
    this.config.harmonicity = value;
  }

  get harmonicity(): number {
    return this.config.harmonicity;
  }

  set volume(value: number) {
    this.instrument.set({volume: value});
    this.config.volume = value;
  }

  get volume(): number {
    return this.config.volume;
  }

  set detune(value: number) {
    this.instrument.set({detune: value});
    this.config.detune = value;
  }

  get detune(): number {
    return this.config.detune;
  }

  set portamento(value: number) {
    this.instrument.set({portamento: value});
    this.config.portamento = value;
  }

  get portamento(): number {
    return this.config.portamento;
  }

}
