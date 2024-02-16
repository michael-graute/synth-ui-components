import {Component, Input} from '@angular/core';
import * as Tone from "tone";
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";

export type DuoSynthConfig = {
  voice0: {
    oscillator: {
      type: string;
      volume: number;
      detune: number;
      active: boolean;
      octave: number;
      pan: number;
    },
    envelope: {
      attack: number;
      decay: number;
      sustain: number;
      release: number;
    }
  }
  voice1: {
    oscillator: {
      type: string;
      volume: number;
      detune: number;
      active: boolean;
      octave: number;
      pan: number;
    },
    envelope: {
      attack: number;
      decay: number;
      sustain: number;
      release: number;
    }
  }
}

@Component({
  selector: 'ins-duo-synth',
  standalone: true,
  imports: [],
  templateUrl: './duo-synth.component.html',
  styleUrl: './duo-synth.component.scss'
})
export class DuoSynthComponent extends AbstractSynthComponent<DuoSynthConfig> {

  private synth: Tone.DuoSynth = new Tone.DuoSynth().toDestination();
  @Input() name: string = 'DuoSynth'

  override ngOnInit() {
    super.ngOnInit();
    this.synthService.addInstrument(this.id, this.synth, this.config);
  }

  set voice1Type(type: any) {
    this.synth.voice0.set({oscillator: {type: type}});
    this.config.voice1.oscillator.type = type;
  }

  get voice1Type(): any {
    return this.config.voice1.oscillator.type;
  }

  set voice1Volume(value: number) {
    this.synth.voice0.oscillator.set({volume: value});
    this.config.voice1.oscillator.volume = value;
  }

  get voice1Volume(): number {
   return this.config.voice1.oscillator.volume;
  }

  public override config: DuoSynthConfig = {
    voice0: {
      oscillator: {
        type: 'sine',
        volume: -15,
        detune: 0,
        active: true,
        octave: 0,
        pan: 0
      },
      envelope: {
        attack: 1,
        decay: 10,
        sustain: 30,
        release: 100
      }
    },
    voice1: {
      oscillator: {
        type: 'sine',
        volume: -15,
        detune: 0,
        active: true,
        octave: 0,
        pan: 0
      },
      envelope: {
        attack: 1,
        decay: 10,
        sustain: 30,
        release: 100
      }
    }
  };

}
