import { Component } from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from 'tone';
import { SwitchComponent } from '../../ui-elements/switch/switch.component';
import { FormsModule } from '@angular/forms';
import { WaveformSelectComponent } from '../../ui-elements/waveform-select/waveform-select.component';
import { KnobComponent } from '../../ui-elements/knob/knob.component';
import { MidiOverlayComponent } from '../../managers/midi-manager/midi-overlay/midi-overlay.component';

export type VibratoConfig = {
  active: boolean;
  depth: number;
  frequency: number;
  type: string;
  wet: number;
};

@Component({
    selector: 'ins-vibrato',
    templateUrl: './vibrato.component.html',
    styleUrl: './vibrato.component.scss',
    standalone: true,
    imports: [SwitchComponent, FormsModule, WaveformSelectComponent, KnobComponent, MidiOverlayComponent]
})
export class VibratoComponent extends AbstractSynthComponent<VibratoConfig> {

  protected override instrument: Tone.Vibrato = new Tone.Vibrato();
  protected override componentType = 'effect';
  public override config: VibratoConfig = {
    active: false,
    depth: 0.1,
    frequency: 5,
    type: 'sine',
    wet: 1,
  };

  set depth(depth: number) {
    this.instrument.set({depth: depth});
    this.config.depth = depth;
  }

  get depth(): number {
    return this.config.depth;
  }

  set frequency(frequency: number) {
    this.instrument.set({frequency: frequency});
    this.config.frequency = frequency;
  }

  get frequency(): number {
    return this.config.frequency;
  }

  set type(type: any) {
    this.instrument.set({type: type});
    this.config.type = type;
  }

  get type(): any {
    return this.config.type;
  }

  set wet(wet: number) {
    this.instrument.set({wet: wet});
    this.config.wet = wet;
  }

  get wet(): number {
    return this.config.wet;
  }

}
