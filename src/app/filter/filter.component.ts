import {Component, Input} from '@angular/core';

@Component({
  selector: 'ins-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {
  @Input() type: string = 'highpass';
}
