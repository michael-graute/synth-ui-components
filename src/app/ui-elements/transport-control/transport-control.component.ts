import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'ins-transport-control',
  templateUrl: './transport-control.component.html',
  styleUrl: './transport-control.component.scss'
})
export class TransportControlComponent {

  public playing: boolean = false;
  public recording: boolean = false;
  public paused: boolean = false;

  @Input() playButton: boolean = true;
  @Input() pauseButton: boolean = true;
  @Input() stopButton: boolean = true;
  @Input() recordButton: boolean = true;

  @Output() playButtonClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() stopButtonClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() pauseButtonClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() recordButtonClick: EventEmitter<void> = new EventEmitter<void>();


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
}
