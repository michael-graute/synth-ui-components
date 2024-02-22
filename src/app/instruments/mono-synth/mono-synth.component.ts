import {Component, Input} from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from "tone";
import {ADSREnvelopeConfig, OscillatorConfig} from "../../types/config.types";

export type MonoSynthConfig = {
  active: boolean;
  volume: number;
  detune: number;
  portamento: number;
  oscillator: OscillatorConfig;
  envelope: ADSREnvelopeConfig;
}

@Component({
  selector: 'ins-mono-synth',
  templateUrl: './mono-synth.component.html',
  styleUrl: './mono-synth.component.scss'
})
export class MonoSynthComponent extends AbstractSynthComponent<MonoSynthConfig> {

  @Input() name: string = 'MonoSynth';
  @Input() polyphonic: boolean = true;

  protected override componentType: string = 'instrument';
  protected override instrument: Tone.MonoSynth | Tone.PolySynth = new Tone.MonoSynth();
  public override config: MonoSynthConfig = {
    active: true,
    volume: -15,
    detune: 0,
    portamento: 0,
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
    }
  }

  override ngOnInit() {
    if(this.polyphonic) {
      this.instrument = new Tone.PolySynth(Tone.MonoSynth);
    } else {
      this.instrument = new Tone.MonoSynth();
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

  set volume(value: number) {
    this.instrument.volume.value = value;
    this.config.volume = value;
  }

  get volume(): number {
    return this.config.volume;
  }
}
