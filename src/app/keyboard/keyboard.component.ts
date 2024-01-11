import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'ins-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements OnInit {
  octaveBase : number = 0;
  public notes : string[] = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  public octaves : number[] = [];
  public msDwn : boolean = false;
  public heldNote: string = "";
  public lastNote : string = "";
  public currentNote : string = "";
  public hold : boolean = false;

  @Output() noteOn: EventEmitter<string> = new EventEmitter<string>();
  @Output() noteOff: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    this.changeOctave(2)
  }

  play(note:string){
    /*this.synthService.currentNote = note;
    if(this.synthService.sequencerEnabled) {
      this.synthService.sequencerRootNote = note;
      this.synthService.playSequence();
    } else {
      this.synthService.play();
    }*/
  }

  stop(){
    /*if(this.synthService.sequencerEnabled) {
      this.synthService.sequencerRootNote = "C4";
      this.synthService.stopSequence();
    } else {
      this.synthService.stop();
    }*/
  }

  mouseDown(note:string, octave:number){
    this.msDwn = true;
    this.play(note + octave);
    this.lastNote = note + octave;
    this.heldNote = note + octave;
    this.currentNote = note + octave;
    this.noteOn.emit(this.currentNote);
  }

  mouseUp(){
    this.msDwn = false;
    this.heldNote = "";
    this.lastNote = "";
    this.stop();
    this.noteOff.emit(this.currentNote);
  }

  mouseOut(){
  }

  mouseOver(note:string, octave:number){
    /*if(this.msDwn) {
      if(this.synthService.sequencerEnabled && (note + octave) != this.lastNote) {
          this.synthService.currentNote = note + octave;
          this.synthService.sequencerRootNote = note + octave;
      } else if(!this.synthService.sequencerEnabled) {
        this.play(note + octave);
      }
      this.lastNote = note + octave;
    }*/
  }

  changeOctave(octave:number){
    if(this.octaveBase < 0) this.octaveBase = 4;
    if(this.octaveBase > 4) this.octaveBase = -1;
    this.octaveBase = this.octaveBase + octave;
    this.octaves = [this.octaveBase + 1, this.octaveBase + 2, this.octaveBase + 3]
  }

  ngOnInit(): void {
    /*this.synthService.noteOn.subscribe((note: string) => {
      this.currentNote = note;
      this.changeDetectorRef.detectChanges();
    });*/
  }

  toggleHold() {
    this.hold = !this.hold;
  }
}
