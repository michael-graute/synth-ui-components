import {Component, Input} from '@angular/core';

@Component({
  selector: 'ins-waveform-select',
  templateUrl: './waveform-select.component.html',
  styleUrls: ['./waveform-select.component.scss']
})
export class WaveformSelectComponent {
  @Input() waveform: string = 'sine';
}
