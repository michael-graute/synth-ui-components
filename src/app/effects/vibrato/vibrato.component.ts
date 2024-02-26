import { Component } from '@angular/core';

export type VibratoConfig = {
  depth: number;
  speed: number;
};

@Component({
  selector: 'ins-vibrato',
  templateUrl: './vibrato.component.html',
  styleUrl: './vibrato.component.scss'
})
export class VibratoComponent {

}
