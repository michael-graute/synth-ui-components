import {Component, Input} from '@angular/core';
import {RecursivePartial} from "tone/build/esm/core/util/Interface";
import * as Tone from "tone";

@Component({
  selector: 'ins-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  @Input() type: string = 'highpass';

  cutoff: number = 0;
  resonance: number = 0;

  public envelopeOptions: RecursivePartial<Omit<Tone.EnvelopeOptions, "context">> = {
    attack: 15,
    decay: 30,
    sustain: .7,
    release: 25
  };

  public active: boolean = true;
}
