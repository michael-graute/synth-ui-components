import {Component, Input} from '@angular/core';

@Component({
  selector: 'ins-divider',
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss'
})
export class DividerComponent {
  @Input() label: string | undefined;
}
