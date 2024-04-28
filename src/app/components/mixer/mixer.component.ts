import {Component, Input, OnInit} from '@angular/core';
import {v4 as uuidv4} from "uuid";


export type InsMixerChannel = {
  id: string,
  name: string,
  volume: number,
  panning: number,
  mute: boolean,
  solo: boolean,
  instrument: any,
  effects: any[],
  control: string
}

@Component({
  selector: 'ins-mixer',
  templateUrl: './mixer.component.html',
  styleUrl: './mixer.component.scss'
})
export class MixerComponent implements OnInit {

  @Input() id: string = uuidv4();

  public channels: InsMixerChannel[] = []

  ngOnInit() {
    for(let i = 0; i < 6; i++) {
      this.addChannel({
        id: 'synth' + i,
        name: 'Foo Bar',
        volume: -4,
        panning: 0,
        mute: false,
        solo: false,
        instrument: 'DuoSynth',
        effects: [],
        control: 'keyboard'
      });
    }
  }

  addChannel(channel: InsMixerChannel): void {
    this.channels.push(channel);
  }

  removeChannel(channelId: string): void {
    this.channels = this.channels.filter((channel: InsMixerChannel) => channel.id !== channelId);
  }

  debug(): void {
    console.log(this.channels);
  }

}
