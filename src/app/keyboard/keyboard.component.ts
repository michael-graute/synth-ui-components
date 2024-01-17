import {Component, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {SynthService} from "../synth.service";

@Component({
  selector: 'ins-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements OnInit {
  private octaveBase : number = 0;
  public charMap: string[] = ["a","w","s","e","d","f","t","g","z","h","u","j"];
  public notes : string[] = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  public octaves : number[] = [];
  public isKeyDown : boolean = false;
  public heldKey: string = "";
  public heldKeys: string[] = [];
  public hold : boolean = false;

  @Input() service: SynthService | undefined;

  constructor() {
    this.changeOctave(2)
  }

  @HostListener('document:mouseup', ['$event'])
  handleDocumentMouseUpEvent(event: MouseEvent) {
    this.isKeyDown = false;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDownEvent(event: KeyboardEvent) {
    /*if(this.charMap.includes(event.key) && this.heldKey != this.notes[this.charMap.findIndex((element) => element == event.key)] + (this.octaveBase + 1)) {
      const index = this.charMap.findIndex((element) => element == event.key);
      const note = this.notes[index] + (this.octaveBase + 1);
      this.keyDown(note);
    }*/
    if(this.charMap.includes(event.key) && !this.heldKeys.includes(this.notes[this.charMap.findIndex((element) => element == event.key)] + (this.octaveBase + 1))) {
      const index = this.charMap.findIndex((element) => element == event.key);
      const note = this.notes[index] + (this.octaveBase + 1);
      this.keyDown(note);
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUpEvent(event: KeyboardEvent) {
    /*if(this.charMap.includes(event.key)) {
      const index = this.charMap.findIndex((element) => element == event.key);
      const note = this.notes[index] + (this.octaveBase + 1);
      if(note === this.heldKey) {
        this.keyUp(note);
      }
    }*/
    if(this.charMap.includes(event.key)) {
      const index = this.charMap.findIndex((element) => element == event.key);
      const note = this.notes[index] + (this.octaveBase + 1);
      this.keyUp(note);
    }
  }

  keyUp(key:string){
    //if(!this.hold) {
      this.service?.keyUp(key);
    //}
  }

  keyDown(key:string){
    //if(this.hold && this.heldKey === key) {
      this.service?.keyDown(key);
    /*} else {
      this.service?.keyDown(key);
    }*/
  }

  mouseDown(key:string){
    this.isKeyDown = true;
    this.service?.keyDown(key);
  }

  mouseUp(key:string){
    if(this.isKeyDown && this.heldKeys.includes(key)) {
      this.service?.keyUp(key);
      this.isKeyDown = false;
    }
  }

  mouseOver(key:string){
    if(this.isKeyDown && !this.heldKeys.includes(key) && !this.hold) {
      this.service?.keyDown(key);
    }
  }

  mouseOut(key:string){
    if(this.isKeyDown && this.heldKeys.includes(key)) {
      this.service?.keyUp(key);
    }
  }

  changeOctave(octave:number){
    if(this.octaveBase < 0) this.octaveBase = 4;
    if(this.octaveBase > 4) this.octaveBase = -1;
    this.octaveBase = this.octaveBase + octave;
    this.octaves = [this.octaveBase + 1, this.octaveBase + 2, this.octaveBase + 3]
  }

  ngOnInit(): void {
    this.service?.keyDownEvent.subscribe((note: string) => {
      this.isKeyDown = true;
      this.heldKey = note;
      this.heldKeys.push(note);
    });
    this.service?.keyUpEvent.subscribe((note: string) => {
      //this.isKeyDown = false;
      this.heldKey = "";
      this.heldKeys = this.heldKeys.filter((element) => element != note);
    });
  }

  toggleHold() {
    this.hold = !this.hold;
    if(!this.hold && this.heldKey != "") this.keyUp(this.heldKey);
  }
}
