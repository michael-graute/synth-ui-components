import {Component, Input} from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'ins-divider',
    templateUrl: './divider.component.html',
    styleUrl: './divider.component.scss',
    standalone: true,
    imports: [NgIf]
})
export class DividerComponent {
  @Input() label: string | undefined;
}
