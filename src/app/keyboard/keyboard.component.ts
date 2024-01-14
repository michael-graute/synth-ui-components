import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {SynthService} from "../synth.service";

@Component({
  selector: 'ins-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements OnInit {
  octaveBase : number = 0;
  charMap: string[] = ["a","w","s","e","d","f","t","g","z","h","u","j"];
  public notes : string[] = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  public octaves : number[] = [];
  public msDwn : boolean = false;
  public heldNote: string = "";
  public lastNote : string = "";
  public currentNote : string = "";
  public hold : boolean = false;

  @Input() service: SynthService | undefined;

  @Output() keyDown: EventEmitter<string> = new EventEmitter<string>();
  @Output() keyUp: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    this.changeOctave(2)
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if(this.charMap.includes(event.key) && this.heldNote != this.notes[this.charMap.findIndex((element) => element == event.key)] + (this.octaveBase + 1)) {
      event.preventDefault();
      const index = this.charMap.findIndex((element) => element == event.key);
      this.mouseDown(this.notes[index] + (this.octaveBase + 1));
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardUpEvent(event: KeyboardEvent) {
    if(this.charMap.includes(event.key)) {
      const index = this.charMap.findIndex((element) => element == event.key);
      const note = this.notes[index] + (this.octaveBase + 1)
      if(note === this.currentNote) {
        this.mouseUp(event.key);
      }
    }
  }

  mouseDown(note:string){
    this.msDwn = true;
    this.heldNote = note;
    this.service?.noteOn(note);
    this.keyDown.emit(note);
  }

  mouseUp(note:string){
    this.msDwn = false;
    this.heldNote = "";
    this.service?.noteOff(this.currentNote);
    this.keyUp.emit(this.currentNote);
  }

  mouseOver(note:string){
    if(this.msDwn && this.heldNote != note) {
      this.service?.noteOn(note);
    }
  }

  changeOctave(octave:number){
    if(this.octaveBase < 0) this.octaveBase = 4;
    if(this.octaveBase > 4) this.octaveBase = -1;
    this.octaveBase = this.octaveBase + octave;
    this.octaves = [this.octaveBase + 1, this.octaveBase + 2, this.octaveBase + 3]
  }

  ngOnInit(): void {
    this.service?.noteOnEvent.subscribe((note: string) => {
      this.currentNote = note;
      this.lastNote = note;
      this.heldNote = note;
    });
    this.service?.noteOffEvent.subscribe((note: string) => {
      this.currentNote = "";
      this.lastNote = "";
    });
  }

  toggleHold() {
    this.hold = !this.hold;
  }
}
