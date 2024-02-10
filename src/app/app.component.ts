import {Component} from '@angular/core';

@Component({
  selector: 'ins-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  _keyboardVisible: boolean = true;
  _sequencerVisible: boolean = true;
  keyboardHeight: string = '300px';
  sequencerHeight: string = '550px';

  gridTemplateRows: string[] = ['80px', '1fr', this.sequencerHeight, this.keyboardHeight];

  public page: string = 'main';

  set keyboardVisible(value: boolean) {
    this._keyboardVisible = value;
    this.gridTemplateRows[3] = this._keyboardVisible ? this.keyboardHeight : '30px';
    this.gridTemplateRows = JSON.parse(JSON.stringify(this.gridTemplateRows));
  }

  getGridTemplateRows(): string {
    return this.gridTemplateRows.join(' ');
  }

  get keyboardVisible(): boolean {
    return this._keyboardVisible;
  }

  set sequencerVisible(value: boolean) {
    this._sequencerVisible = value;
    this.gridTemplateRows[2] = this._sequencerVisible ? this.sequencerHeight : '30px';
  }

  get sequencerVisible(): boolean {
    return this._sequencerVisible;
  }
}
