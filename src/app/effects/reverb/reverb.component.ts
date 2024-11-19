import { Component } from '@angular/core';
import * as Tone from "tone";
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import { SwitchComponent } from '../../ui-elements/switch/switch.component';
import { FormsModule } from '@angular/forms';
import { KnobComponent } from '../../ui-elements/knob/knob.component';
import { MidiOverlayComponent } from '../../managers/midi-manager/midi-overlay/midi-overlay.component';

export type ReverbConfig = {
  active: boolean;
  decay: number;
  wet: number;
  preDelay: number;
}

@Component({
    selector: 'ins-reverb',
    templateUrl: './reverb.component.html',
    styleUrl: './reverb.component.scss',
    standalone: true,
    imports: [SwitchComponent, FormsModule, KnobComponent, MidiOverlayComponent]
})
export class ReverbComponent extends AbstractSynthComponent<ReverbConfig> {

  override instrument: Tone.Reverb = new Tone.Reverb({decay: 2.5, wet: 0.8});
  override componentType: string = 'effect';

  public override config: ReverbConfig = {
    active: false,
    decay: 2.5,
    wet: 0.8,
    preDelay: 0.01
  }

  set decay(value: number) {
    this.instrument.decay = value;
    this.config.decay = value;
  }

  get decay(): number {
    return this.config.decay;

  }

  set wet(value: number) {
    this.instrument.wet.value = value;
    this.config.wet = value;
  }

  get wet(): number {
    return this.config.wet;
  }

  set preDelay(value: number) {
    this.instrument.preDelay = value;
    this.config.preDelay = value;
  }

  get preDelay(): number {
    return this.config.preDelay;
  }
}
