import { Component } from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from 'tone';
import { SwitchComponent } from '../../ui-elements/switch/switch.component';
import { FormsModule } from '@angular/forms';
import { DividerComponent } from '../../ui-elements/divider/divider.component';
import { WaveformSelectComponent } from '../../ui-elements/waveform-select/waveform-select.component';
import { KnobComponent } from '../../ui-elements/knob/knob.component';
import { MidiOverlayComponent } from '../../managers/midi-manager/midi-overlay/midi-overlay.component';
import { ButtonGroupComponent } from '../../ui-elements/button-group/button-group.component';

export type AutoFilterConfig = {
  active: boolean;
  baseFrequency: number;
  frequency: number;
  depth: number;
  octaves: number;
  type: string;
  wet: number;
  filter: {
    type: string;
    rolloff: number;
    Q: number;
  }
};

@Component({
    selector: 'ins-auto-filter',
    templateUrl: './auto-filter.component.html',
    styleUrl: './auto-filter.component.scss',
    standalone: true,
    imports: [SwitchComponent, FormsModule, DividerComponent, WaveformSelectComponent, KnobComponent, MidiOverlayComponent, ButtonGroupComponent]
})
export class AutoFilterComponent extends AbstractSynthComponent<AutoFilterConfig> {
    protected override startEffectLfoAtActivation = true;
    protected override instrument: Tone.AutoFilter = new Tone.AutoFilter();
    protected override componentType = 'effect';
    public override config: AutoFilterConfig = {
      active: false,
      baseFrequency: 200,
      frequency: 1,
      depth: 0.5,
      octaves: 2.6,
      type: 'sine',
      wet: 1,
      filter: {
        type: 'lowpass',
        rolloff: 0,
        Q: 1
      }
    };

    public rollOffOptions: any = [-12, -24, -48, -96];

    set baseFrequency(baseFrequency: number) {
      this.instrument.set({baseFrequency: baseFrequency});
      this.config.baseFrequency = baseFrequency;
    }

    get baseFrequency(): number {
      return this.config.baseFrequency;
    }

    set frequency(frequency: number) {
      this.instrument.set({frequency: frequency});
      this.config.frequency = frequency;
    }

    get frequency(): number {
      return this.config.frequency;
    }

    set depth(depth: number) {
      this.instrument.set({depth: depth});
      this.config.depth = depth;
    }

    get depth(): number {
      return this.config.depth;
    }

    set octaves(octaves: number) {
      this.instrument.set({octaves: octaves});
      this.config.octaves = octaves;
    }

    get octaves(): number {
      return this.config.octaves;
    }

    set type(type: any) {
      this.instrument.set({type: type});
      this.config.type = type;
    }

    get type(): string {
      return this.config.type;
    }

    set wet(wet: number) {
      this.instrument.wet.value = wet;
      this.config.wet = wet;
    }

    get wet(): number {
      return this.config.wet;
    }

    set filterType(type: any) {
      this.instrument.set({filter: {type: type}});
      this.config.filter.type = type;
    }

    get filterType(): string {
      return this.config.filter.type;
    }

    set filterRolloff(rolloff: any) {
      this.instrument.set({filter: {rolloff: this.rollOffOptions[rolloff]}});
      this.config.filter.rolloff = rolloff;
    }

    get filterRolloff(): number {
      return this.config.filter.rolloff;
    }

    set filterQ(Q: any) {
      this.instrument.set({filter: {Q: Q}});
      this.config.filter.Q = Q;
    }

    get filterQ(): number {
      return this.config.filter.Q;
    }
}
