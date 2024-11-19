import {Component, Input} from '@angular/core';
import {v4 as uuidv4} from "uuid";
import {InsMixerChannel} from "../mixer.component";
import { SliderComponent } from '../../../ui-elements/slider/slider.component';
import { FormsModule } from '@angular/forms';
import { KnobComponent } from '../../../ui-elements/knob/knob.component';
import { SwitchComponent } from '../../../ui-elements/switch/switch.component';

@Component({
    selector: 'ins-mixer-strip',
    templateUrl: './mixer-strip.component.html',
    styleUrl: './mixer-strip.component.scss',
    standalone: true,
    imports: [SliderComponent, FormsModule, KnobComponent, SwitchComponent]
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
