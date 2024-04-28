import {Component, Input} from '@angular/core';
import {v4 as uuidv4} from "uuid";
import {InsMixerChannel} from "../mixer.component";

@Component({
  selector: 'ins-mixer-strip',
  templateUrl: './mixer-strip.component.html',
  styleUrl: './mixer-strip.component.scss'
})
export class MixerStripComponent {

  private _config: InsMixerChannel = {
    id: '',
    name: '',
    instrument: '',
    volume: 0,
    panning: 0,
    mute: false,
    solo: false,
    effects: [],
    control: 'keyboard'
  }

  @Input() id: string = uuidv4();
  @Input() set config(config: InsMixerChannel) {
    this._config = config;
  };

  get config(): InsMixerChannel {
    return this._config;
  }

}
