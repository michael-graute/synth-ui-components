import {Component} from '@angular/core';
import * as Tone from "tone";
import {AbstractSynthComponent} from "../abstracts/abstract-synth.component";

export type LfoConfig = {
  active: boolean;
  frequency: number;
  type: string;
  min: number;
  max: number;
  phase: number;
  amplitude: number;
  sync: boolean;
  amount: number;
}

@Component({
  selector: 'ins-lfo',
  templateUrl: './lfo.component.html',
  styleUrl: './lfo.component.scss'
})
export class LfoComponent extends AbstractSynthComponent<LfoConfig> {
  override config: LfoConfig = {
    active: true,
    frequency: 20,
    type: 'sine',
    min: -10,
    max: 10,
    phase: 0,
    amplitude: 1,
    sync: false,
    amount: 10
  };
  lfo: any = new Tone.LFO(this.config.frequency, this.config.min, this.config.max);

  set active(value: boolean) {
    this.config.active = value;
  }

  get active(): boolean {
    return this.config.active;
  }

  set frequency(value: number) {
    this.config.frequency = value;
    this.lfo.frequency.value = value;
  }

  get frequency(): number {
    return this.config.frequency;
  }

  set type(value: string) {
    this.config.type = value;
    this.lfo.type = value;
  }

  get type(): string {
    return this.config.type;
  }

  set min(value: number) {
    this.config.min = value;
    this.lfo.min = value;
  }

  get min(): number {
    return this.config.min;
  }

  set max(value: number) {
    this.config.max = value;
    this.lfo.max = value;
  }

  get max(): number {
    return this.config.max;
  }

  set phase(value: number) {
    this.config.phase = value;
    this.lfo.phase = value;
  }

  get phase(): number {
    return this.config.phase;
  }

  set amplitude(value: number) {
    this.config.amplitude = value;
    this.lfo.amplitude.value = value / 10;
  }

  get amplitude(): number {
    return this.config.amplitude;
  }

  set sync(value: boolean) {
    this.config.sync = value;
    this.lfo.sync = value;
  }

  get sync(): boolean {
    return this.config.sync;
  }

  set amount(value: number) {
    this.config.amount = value;
    this.min = -value;
    this.max = value;
  }

  get amount(): number {
    return this.config.amount;
  }
}
