import { Component } from '@angular/core';
import * as Tone from "tone";
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import { SwitchComponent } from '../../ui-elements/switch/switch.component';
import { FormsModule } from '@angular/forms';
import { KnobComponent } from '../../ui-elements/knob/knob.component';
import { MidiOverlayComponent } from '../../managers/midi-manager/midi-overlay/midi-overlay.component';

export type DelayConfig = {
  active: boolean;
  time: number;
  feedback: number;
  wet: number;
  maxDelay: number;
}

@Component({
    selector: 'ins-delay',
    templateUrl: './feedback-delay.component.html',
    styleUrl: './feedback-delay.component.scss',
    standalone: true,
    imports: [SwitchComponent, FormsModule, KnobComponent, MidiOverlayComponent]
})
export class FeedbackDelayComponent extends AbstractSynthComponent<DelayConfig> {
  override instrument: Tone.FeedbackDelay = new Tone.FeedbackDelay(.5, .5);
  override componentType: string = 'effect';

  public override config: DelayConfig = {
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
