import { Component } from '@angular/core';

@Component({
  selector: 'ins-sequencer-step',
  templateUrl: './sequencer-step.component.html',
  styleUrl: './sequencer-step.component.scss'
})
export class SequencerStepComponent {
  gateOptions: string[] = ['1n', '2n', '4n', '8n', '16n', '32n', '64n'];
}
