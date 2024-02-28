import {Component, OnInit} from '@angular/core';
import {SynthService} from "./synth.service";
import * as Tone from 'tone';

@Component({
  selector: 'ins-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  _keyboardVisible: boolean = true;
  //_sequencerVisible: boolean = false;
  keyboardHeight: string = '300px';
  //sequencerHeight: string = '550px';

  gridTemplateRows: string[] = ['80px', '1fr', this.keyboardHeight];

  public page: string = 'main';
  public audioContextReady: boolean = false;

  constructor(private synthService: SynthService) {
  }

  ngOnInit() {
  }

  startAudioContext() {
    Tone.start().then(() => {
      this.audioContextReady = true;
    })
  }

  set keyboardVisible(value: boolean) {
    this._keyboardVisible = value;
    this.gridTemplateRows[2] = this._keyboardVisible ? this.keyboardHeight : '30px';
    this.gridTemplateRows = JSON.parse(JSON.stringify(this.gridTemplateRows));
  }

  getGridTemplateRows(): string {
    return this.gridTemplateRows.join(' ');
  }

  get keyboardVisible(): boolean {
    return this._keyboardVisible;
  }

  /*set sequencerVisible(value: boolean) {
    this._sequencerVisible = value;
    this.gridTemplateRows[2] = this._sequencerVisible ? this.sequencerHeight : '30px';
  }

  get sequencerVisible(): boolean {
    return this._sequencerVisible;
  }*/

  debug() {
    console.log(this.synthService.effects);
  }
}
