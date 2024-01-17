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
    attack: 15,
    decay: 30,
    sustain: 70,
    release: 25
  };
  @Input() synth: Tone.PolySynth = new Tone.PolySynth(Tone.Synth).toDestination();
  @Input() name: string = 'Oscillator'
  @Input() midiLearn: boolean = false;
  @Input() service: SynthService | undefined = undefined

  public active: boolean = true;

  constructor() {
    this.synth.volume.value = -10;
    this.synth.set({oscillator: {type: 'sine'}});
    this.setAdsr();
  }

  ngOnInit() {
    if(this.service) {
      this.service.noteOnEvent.subscribe((event: any) => {
        if(this.active) {
          this.synth.triggerAttack(event);
        }
      });
      this.service.noteOffEvent.subscribe((event: any) => {
        if(this.active) {
          this.synth.triggerRelease(event);
        }
      });
      this.service.attackReleaseEvent.subscribe((event: any) => {
        if(this.active) {
          this.synth.triggerAttackRelease(event.note, event.duration, event.time, event.velocity);
        }
      });
    }
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
    this.synth.set({envelope: options});
  }
}
