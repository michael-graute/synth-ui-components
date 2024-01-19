import {Component, Input} from '@angular/core';
import * as Tone from "tone";
import {RecursivePartial} from "tone/build/esm/core/util/Interface";
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
  public envelopeOptions: RecursivePartial<Omit<Tone.EnvelopeOptions, "context">> = {
    attack: 1,
    decay: 10,
    sustain: 30,
    release: 100
  };
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

  public override config: OscillatorConfig = {
    volume: -10,
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

  @Input() set volume(value: number) {
    this.synth.set({volume: value});
    this.config.volume = value;
  }

  get volume(): number {
    return Math.round(this.synth.get().volume);
  }

  set detune(value: number) {
    this.synth.set({detune: value});
    this.config.detune = value;
  }

  get detune(): number {
    return this.config.detune;
  }

  override ngOnInit() {
    super.ngOnInit();
    console.log(this.type);
    if(!this.type) {
      this.type = 'sine';
    }
    //this.synth.set({volume: -10});
    //this.synth.set({oscillator: {type: this.type}});
    this.setAdsr();

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

  connectTo(destination: any): void {
    this.synth.connect(destination);
  }

  disconnectFrom(destination: any): void {
    this.synth.disconnect(destination);
  }

  toggleActive(): void {
    this.active = !this.active;
  }

  setWaveForm(waveForm: any): void {
    this.synth.set({oscillator: {type: waveForm}});
  }

  setAdsr(): void {
    const options = {
      attack: this.envelopeOptions.attack as number <= 0 ? 0.05 : this.envelopeOptions.attack as number / 100,
      decay: this.envelopeOptions.decay as number / 100,
      sustain: this.envelopeOptions.sustain as number / 100,
      release: this.envelopeOptions.release as number <= 0 ? 0.05 : this.envelopeOptions.release as number / 100
    }
    //console.log(this.synth.get());
    //console.log(options);
    this.synth.set({envelope: options});
    this.config.envelope = options;
    //console.log(this.synth.get());
  }
}
