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
    frequency: 2,
    type: 'sine',
    min: -10,
    max: 10,
    phase: 0,
    amplitude: 10,
    sync: false,
    amount: 20
  };
  override instrument: any = new Tone.LFO(this.config.frequency, this.config.min, this.config.max);

  protected override componentType: string = 'lfo';

  override set active(value: boolean) {
    this.config.active = value;
    if(value) {
      this.synthService.startLFO(this.id);
    } else {
      this.synthService.stopLFO(this.id);
    }
  }

  set frequency(value: number) {
    this.config.frequency = value;
    this.instrument.frequency.value = value;
  }

  get frequency(): number {
    return this.config.frequency;
  }

  set type(value: string) {
    this.config.type = value;
    this.instrument.type = value;
  }

  get type(): string {
    return this.config.type;
  }

  set min(value: number) {
    this.config.min = value;
    this.instrument.min = value;
  }

  get min(): number {
    return this.config.min;
  }

  set max(value: number) {
    this.config.max = value;
    this.instrument.max = value;
  }

  get max(): number {
    return this.config.max;
  }

  set phase(value: number) {
    this.config.phase = value;
    this.instrument.phase = value;
  }

  get phase(): number {
    return this.config.phase;
  }

  set amplitude(value: number) {
    this.config.amplitude = value;
    this.instrument.amplitude.value = value / 10;
  }

  get amplitude(): number {
    return this.config.amplitude;
  }

  set sync(value: boolean) {
    this.config.sync = value;
    this.instrument.sync = value;
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
