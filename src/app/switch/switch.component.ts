import {Component, Input} from '@angular/core';

@Component({
  selector: 'ins-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss']
})
export class SwitchComponent {
  @Input() onLabel: string = 'on';
  @Input() offLabel: string = 'off';
  @Input() labelPosition: 'left' | 'right' | 'top' | 'bottom' = 'bottom';

  @Input() value: boolean = false;
}
