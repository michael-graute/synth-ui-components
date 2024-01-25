import {Component, Input} from '@angular/core';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'ins-lfo',
  templateUrl: './lfo.component.html',
  styleUrl: './lfo.component.scss'
})
export class LfoComponent {
  active: boolean = true;
  @Input() id: string = uuidv4();
}
