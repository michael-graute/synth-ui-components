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
    sustain: .7,
    release: 25
  };
  @Input() synth: Tone.Synth = new Tone.Synth({oscillator: {type: 'sawtooth'}, envelope: this.envelopeOptions}).toDestination();
  @Input() name: string = 'Oscillator'
  @Input() midiLearn: boolean = false;
  @Input() service: SynthService | undefined = undefined

  public active: boolean = true;

  constructor() {
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
          this.synth.triggerRelease();
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

  setAdsr(): void {
    this.synth.envelope.attack = this.envelopeOptions.attack as number / 100 ;
    this.synth.envelope.decay = this.envelopeOptions.decay as number / 100;
    this.synth.envelope.sustain = this.envelopeOptions.sustain as number;
    this.synth.envelope.release = this.envelopeOptions.release as number / 100;
  }
}
