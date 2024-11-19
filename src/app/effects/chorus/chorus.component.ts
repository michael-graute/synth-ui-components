import { Component } from '@angular/core';
import * as Tone from "tone";
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import { SwitchComponent } from '../../ui-elements/switch/switch.component';
import { FormsModule } from '@angular/forms';
import { WaveformSelectComponent } from '../../ui-elements/waveform-select/waveform-select.component';
import { KnobComponent } from '../../ui-elements/knob/knob.component';
import { MidiOverlayComponent } from '../../managers/midi-manager/midi-overlay/midi-overlay.component';

export type ChorusConfig = {
  active: boolean;
  delayTime: number;
  depth: number;
  feedback: number;
  frequency: number;
  spread: number;
  type: string;
  wet: number;
}

@Component({
    selector: 'ins-chorus',
    templateUrl: './chorus.component.html',
    styleUrl: './chorus.component.scss',
    standalone: true,
    imports: [SwitchComponent, FormsModule, WaveformSelectComponent, KnobComponent, MidiOverlayComponent]
})
export class ChorusComponent extends AbstractSynthComponent<ChorusConfig> {
  protected override startEffectLfoAtActivation: boolean  = true;
  override instrument: Tone.Chorus = new Tone.Chorus();
  override componentType: string = 'effect';

  public override config: ChorusConfig = {
    active: false,
    delayTime: .5,
    depth: .7,
    feedback: .5,
    frequency: 2,
    spread: 180,
    type: 'sine',
    wet: .5,
  }

  set delayTime(value: number) {
    this.instrument.delayTime = value;
    this.config.delayTime = value;
  }

  get delayTime(): number {
    return this.config.delayTime;
  }

  set depth(value: number) {
    this.instrument.depth = value;
    this.config.depth = value;
  }

  get depth(): number {
    return this.config.depth;
  }

  set feedback(value: number) {
    this.instrument.feedback.value = value;
    this.config.feedback = value;
  }

  get feedback(): number {
    return this.config.feedback;
  }

  set frequency(value: number) {
    this.instrument.set({frequency: value});
    this.config.frequency = value;
  }

  get frequency(): number {
    return this.config.frequency;
  }

  set spread(value: number) {
    this.instrument.spread = value;
    this.config.spread = value;
  }

  get spread(): number {
    return this.config.spread;
  }

  set type(type: any) {
    this.instrument.set({type: type});
    this.config.type = type;
  }

  get type(): string {
    return this.config.type;
  }

  set wet(value: number) {
    this.instrument.wet.value = value;
    this.config.wet = value;
  }

  get wet(): number {
    return this.config.wet;
  }
}
