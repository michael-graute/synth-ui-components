import {Component, Input} from '@angular/core';
import { AbstractSynthComponent } from "../../abstracts/abstract-synth.component";
import * as Tone from "tone";
import { SwitchComponent } from '../../ui-elements/switch/switch.component';
import { FormsModule } from '@angular/forms';
import { KnobComponent } from '../../ui-elements/knob/knob.component';
import { MidiOverlayComponent } from '../../managers/midi-manager/midi-overlay/midi-overlay.component';

export type PluckSynthConfig = {
  active: boolean;
  volume: number;
  octave: number;
  resonance: number;
  dampening: number;
  attackNoise: number;
  release: number;
}

@Component({
    selector: 'ins-pluck-synth',
    templateUrl: './pluck-synth.component.html',
    styleUrl: './pluck-synth.component.scss',
    standalone: true,
    imports: [SwitchComponent, FormsModule, KnobComponent, MidiOverlayComponent]
})
export class PluckSynthComponent extends AbstractSynthComponent<PluckSynthConfig> {
  @Input() name: string = 'PluckSynth';
  protected override componentType: string = 'instrument';
  protected override instrument: Tone.PluckSynth = new Tone.PluckSynth();
  public override config: PluckSynthConfig = {
    active: false,
    volume: -15,
    octave: 0,
    resonance: 0.7,
    dampening: 4000,
    attackNoise: 1,
    release: 1,
  };

  set resonance(value: number) {
    this.instrument.set({resonance: value});
    this.config.resonance = value;
  }

  get resonance(): number {
    return this.config.resonance;
  }

  set dampening(value: number) {
    this.instrument.set({dampening: value});
    this.config.dampening = value;
  }

  get dampening(): number {
    return this.config.dampening;
  }

  set attackNoise(value: number) {
    this.instrument.set({attackNoise: value});
    this.config.attackNoise = value;
  }

  get attackNoise(): number {
    return this.config.attackNoise;
  }

  set release(value: number) {
    this.instrument.set({release: value});
    this.config.release = value;
  }

  get release(): number {
    return this.config.release;
  }

  set volume(value: number) {
    this.instrument.set({volume: value});
    this.config.volume = value;
  }

  get volume(): number {
    return this.config.volume;
  }

  set octave(value: number) {
    this.config.octave = value;
  }

  get octave(): number {
    return this.config.octave;
  }

}
