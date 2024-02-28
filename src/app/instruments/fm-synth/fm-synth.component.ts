import { Component } from '@angular/core';
import {AbstractSynthComponent} from "../../abstracts/abstract-synth.component";
import * as Tone from "tone";

export type FmSynthConfig = {
  active: boolean
}

@Component({
  selector: 'ins-fm-synth',
  templateUrl: './fm-synth.component.html',
  styleUrl: './fm-synth.component.scss'
})
export class FmSynthComponent extends AbstractSynthComponent<FmSynthConfig> {

  protected override instrument: Tone.FMSynth = new Tone.FMSynth();
  protected override componentType: string = 'instrument';
  public override config: FmSynthConfig = {
    active: false,
  }

}
