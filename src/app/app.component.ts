import {Component} from '@angular/core';
import {SynthService} from "./synth.service";
import * as Tone from 'tone';

@Component({
    selector: 'ins-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {

  _keyboardVisible: boolean = true;
  keyboardHeight: string = '300px';

  gridTemplateRows: string[] = ['80px', '1fr', this.keyboardHeight];

  public page: string = 'main';
  public audioContextReady: boolean = false;

  constructor(private synthService: SynthService) {
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

  debug() {
    console.log(this.synthService.effects);
  }
}
