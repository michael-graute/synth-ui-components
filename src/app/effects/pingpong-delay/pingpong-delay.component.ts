import { Component } from '@angular/core';
import * as Tone from "tone";
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import { SwitchComponent } from '../../ui-elements/switch/switch.component';
import { FormsModule } from '@angular/forms';
import { KnobComponent } from '../../ui-elements/knob/knob.component';
import { MidiOverlayComponent } from '../../managers/midi-manager/midi-overlay/midi-overlay.component';

export type PingpongDelayConfig = {
  active: boolean;
  time: number;
  feedback: number;
  wet: number;
  maxDelay: number;
}

@Component({
    selector: 'ins-pingpong-delay',
    templateUrl: './pingpong-delay.component.html',
    styleUrl: './pingpong-delay.component.scss',
    standalone: true,
    imports: [SwitchComponent, FormsModule, KnobComponent, MidiOverlayComponent]
})
export class PingpongDelayComponent extends AbstractSynthComponent<PingpongDelayConfig> {
  override instrument: Tone.PingPongDelay = new Tone.PingPongDelay(.5, .5);
  override componentType: string = 'effect';

  public override config: PingpongDelayConfig = {
    active: false,
    time: .5,
    feedback: .5,
    wet: .5,
    maxDelay: 5
  }

  set time(value: number) {
    this.instrument.delayTime.value = value;
    this.config.time = value;
  }

  get time(): number {
    return this.config.time;
  }

  set feedback(value: number) {
    this.instrument.feedback.value = value;
    this.config.feedback = value;
  }

  get feedback(): number {
    return this.config.feedback;
  }

  set wet(value: number) {
    this.instrument.wet.value = value;
    this.config.wet = value;
  }

  get wet(): number {
    return this.config.wet;
  }
}
