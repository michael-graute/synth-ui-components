import {Component, Input} from '@angular/core';
import * as Tone from "tone";
import {SynthService} from "../synth.service";
import {AbstractSynthComponent} from "../abstracts/abstract-synth.component";

export interface OscillatorConfig {
  volume: number;
  detune: number;
  active: boolean;
  octave: number;
  pan: number;
  type: string;
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  }
}

@Component({
  selector: 'ins-oscillator',
  templateUrl: './oscillator.component.html',
  styleUrls: ['./oscillator.component.scss']
})
export class OscillatorComponent extends AbstractSynthComponent {

  @Input() synth: Tone.PolySynth = new Tone.PolySynth(Tone.Synth).toDestination();
  @Input() name: string = 'Oscillator'
  @Input() service: SynthService | undefined = undefined
  @Input() set type(type: any) {
    this.synth.set({oscillator: {type: type}});
    this.config.type = type;
  }

  get type(): any {
    return this.config.type;
  }

  @Input() set volume(value: number) {
    this.synth.set({volume: value});
    this.config.volume = value;
  }

  get volume(): number {
   return this.config.volume;
  }

  public override config: OscillatorConfig = {
    volume: -5,
    detune: 0,
    active: true,
    octave: 0,
    type: 'sine',
    pan: 0,
    envelope: {
      attack: 1,
      decay: 10,
      sustain: 30,
      release: 100
    }
  };

  set pan(value: number) {
    this.config.pan = value;
  }

  get pan(): number {
    return this.config.pan;
  }

  set active(value: boolean) {
    this.config.active = value;
  }

  get active(): boolean {
    return this.config.active;
  }

  set octave(value: number) {
    this.config.octave = value;
  }

  get octave(): number {
    return this.config.octave;
  }

  set detune(value: number) {
    this.synth.set({detune: value});
    this.config.detune = value;
  }

  get detune(): number {
    return this.config.detune;
  }

  set envelope(options: any) {
    const newOptions = {
      attack: options.attack as number <= 0 ? 0.05 : options.attack as number / 100,
      decay: options.decay as number / 100,
      sustain: options.sustain as number / 100,
      release: options.release as number <= 0 ? 0.05 : options.release as number / 100
    }
    this.synth.set({envelope: newOptions});
    this.config.envelope = options;
  }

  get envelope(): any {
    return this.config.envelope;
  }

  override ngOnInit() {
    super.ngOnInit();
    this.service?.noteOnEvent.subscribe((event: any) => {
      if(this.active) {
        const note = Tone.Frequency(event).transpose((this.octave || 0) * 12).toNote();
        this.synth.triggerAttack(note);
      }
    });
    this.service?.noteOffEvent.subscribe((event: any) => {
      if(this.active) {
        const note = Tone.Frequency(event).transpose((this.octave || 0) * 12).toNote();
        this.synth.triggerRelease(note);
      }
    });
    this.service?.attackReleaseEvent.subscribe((event: any) => {
      if(this.active) {
        this.synth.triggerAttackRelease(event.note, event.duration, event.time, event.velocity);
      }
    });
  }
}
