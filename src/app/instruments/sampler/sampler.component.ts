import {Component, Input} from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from 'tone';
import {OneShotSourceCurve} from "tone/build/esm/source/OneShotSource";

export type SamplerConfig = {
  active: boolean;
  volume: number;
  release: number;
  attack: number;
  curve: string;
  samplePack: SamplePack;
};

export type SamplePack = {
  urls: any;
  baseUrl: string;
}

@Component({
  selector: 'ins-sampler',
  templateUrl: './sampler.component.html',
  styleUrl: './sampler.component.scss'
})
export class SamplerComponent extends AbstractSynthComponent<SamplerConfig> {
  samplePacks: {[key:string]: SamplePack} = {
    'flute-clean': {
      urls: {
        A2: "FluteClean_A2.wav",
        C2: "FluteClean_C2.wav",
        D2: "FluteClean_D2.wav",
      },
      baseUrl: '/assets/audio/sample-packs/flute-clean/'
    },
    'salamander': {
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3"
      },
      baseUrl: 'https://tonejs.github.io/audio/salamander/'
    }
  }

  @Input() name: string = 'Sampler';
  public override config: SamplerConfig = {
    active: true,
    volume: -15,
    release: 1,
    attack: 0,
    curve: 'linear',
    samplePack: this.samplePacks['salamander']
  };
  protected override componentType: string = 'instrument';
  protected override instrument: Tone.Sampler = new Tone.Sampler(this.config.samplePack.urls, this.loaded.bind(this), this.config.samplePack.baseUrl);

  loaded(): void {}

  set volume(value: number) {
    this.instrument.volume.value = value;
    this.config.volume = value;
  }

  get volume(): number {
    return this.config.volume;
  }

  set release(value: number) {
    this.instrument.release = value;
    this.config.release = value;
  }

  get release(): number {
    return this.config.release;
  }

  set attack(value: number) {
    this.instrument.attack = value;
    this.config.attack = value;
  }

  get attack(): number {
    return this.config.attack;
  }

  set curve(value: OneShotSourceCurve) {
    this.instrument.curve = value;
    this.config.curve = value;
  }

  get curve(): string {
    return this.config.curve.toString();
  }

  loadSamplePack(name: string): void {
    this.instrument = new Tone.Sampler(this.samplePacks[name].urls, this.loaded.bind(this), this.samplePacks[name].baseUrl);
    this.synthService.replaceInstrument(this.id, this.instrument, this.config);
  }
}
