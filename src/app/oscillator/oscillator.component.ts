import {Component, Input, OnInit} from '@angular/core';
import * as Tone from "tone";
import {RecursivePartial} from "tone/build/esm/core/util/Interface";
import {SynthService} from "../synth.service";

@Component({
  selector: 'ins-oscillator',
  templateUrl: './oscillator.component.html',
  styleUrls: ['./oscillator.component.scss']
})
export class OscillatorComponent implements OnInit {
  public envelopeOptions: RecursivePartial<Omit<Tone.EnvelopeOptions, "context">> = {
    attack: 1,
    decay: 10,
    sustain: 30,
    release: 100
  };
  @Input() synth: Tone.PolySynth = new Tone.PolySynth(Tone.Synth).toDestination();
  @Input() name: string = 'Oscillator'
  @Input() midiLearn: boolean = false;
  @Input() service: SynthService | undefined = undefined
  @Input() type: 'sine' | 'triangle' = 'sine';

  public active: boolean = true;

  public octave: number = 0;

  constructor() {
  }

  @Input() set volume(value: number) {
    this.synth.set({volume: value});
  }

  get volume(): number {
    return Math.round(this.synth.get().volume);
  }

  set detune(value: number) {
    this.synth.set({detune: value});
  }

  get detune(): number {
    return this.synth.get().detune;
  }

  ngOnInit() {
    //this.synth.set({volume: -10});
    this.synth.set({oscillator: {type: this.type}});
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
    //console.log(this.synth.get());
  }
}
