import {Component} from '@angular/core';

@Component({
  selector: 'ins-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  foo: number = 48;
  bar: number = 67;
  pan: number = -34;
  adsr: any = {
    attack: 5,
    decay: 1,
    sustain: 10,
    release: 2
  }
  test: string = 'test';

  public page: string = 'main';

  public midiLearn: boolean = false;

  onKnobChange(event: number) {
    console.log('knobChange', event);
  }

  toggleMidiLearn() {
    this.midiLearn = !this.midiLearn;
  }
}
