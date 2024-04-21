import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'ins-transport-control',
  templateUrl: './transport-control.component.html',
  styleUrl: './transport-control.component.scss'
})
export class TransportControlComponent {

  @Input() label: string | undefined;

  @Input() disabled: boolean = false;
  @Input() playing: boolean = false;
  @Input() recording: boolean = false;
  @Input() paused: boolean = false;

  @Input() playButton: boolean = true;
  @Input() pauseButton: boolean = true;
  @Input() stopButton: boolean = true;
  @Input() recordButton: boolean = true;
  @Input() fastButtons: boolean = false;
  @Input() skipButtons: boolean = false;

  @Output() playButtonClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() stopButtonClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() pauseButtonClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() recordButtonClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() skipForwardButtonClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() skipBackwardButtonClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() fastForwardButtonDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() fastForwardButtonUp: EventEmitter<void> = new EventEmitter<void>();
  @Output() fastBackwardButtonDown: EventEmitter<void> = new EventEmitter<void>();
  @Output() fastBackwardButtonUp: EventEmitter<void> = new EventEmitter<void>();


  onPlayButtonClick(): void {
    this.playing = true;
    this.playButtonClick.emit();
  }

  onPauseButtonClick(): void {
    this.playing = false;
    this.paused = true;
    this.pauseButtonClick.emit();
  }

  onStopButtonClick(): void {
    this.playing = false;
    this.stopButtonClick.emit();
  }

  onRecordButtonClick(): void {
    this.recording = !this.recording;
    this.recordButtonClick.emit();
  }

  onSkipBackButtonClick(): void {
    this.skipBackwardButtonClick.emit();
  }

  onSkipForwardButtonClick(): void {
    this.skipForwardButtonClick.emit();
  }

  onFFWDButtonDown(): void {
    this.fastForwardButtonDown.emit();
  }

  onFFWDButtonUp(): void {
    this.fastForwardButtonUp.emit();
  }

  onFBWDButtonDown(): void {
    this.fastBackwardButtonDown.emit();
  }

  onFBWDButtonUp(): void {
    this.fastBackwardButtonUp.emit();
  }
}
