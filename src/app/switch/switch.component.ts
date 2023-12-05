import {Component, Input} from '@angular/core';

@Component({
  selector: 'ins-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent {
  @Input() label: string = '';
}
