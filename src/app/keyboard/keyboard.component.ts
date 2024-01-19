import {ChangeDetectorRef, Component, HostListener, Input, OnInit} from '@angular/core';
import {SynthService} from "../synth.service";
import * as Tone from "tone";


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
  public isMouseDown : boolean = false;
  public heldKeys: string[] = [];
  public hold : boolean = false;

  @Input() service: SynthService | undefined;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.changeOctave(2)
  }

  @HostListener('document:mouseup', ['$event'])
  handleDocumentMouseUpEvent(event: MouseEvent): void {
    this.isMouseDown = false;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDownEvent(event: KeyboardEvent): void {
    if(this.charMap.includes(event.key) && !this.heldKeys.includes(this.notes[this.charMap.findIndex((element: string): boolean => element == event.key)] + (this.octaveBase + 1))) {
      const index: number = this.charMap.findIndex((element: string): boolean => element == event.key);
      const note: string = this.notes[index] + (this.octaveBase + 1);
      this.service?.keyDown(note);
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUpEvent(event: KeyboardEvent): void {
    if(this.charMap.includes(event.key)) {
      const index: number = this.charMap.findIndex((element: string): boolean => element == event.key);
      const note: string = this.notes[index] + (this.octaveBase + 1);
      this.service?.keyUp(note);
    }
  }

  mouseDown(key:string): void {
    this.isMouseDown = true;
    this.service?.keyDown(key);
  }

  mouseUp(key:string): void{
    if(this.isMouseDown && this.heldKeys.includes(key)) {
      this.service?.keyUp(key);
      this.isMouseDown = false;
    }
  }

  mouseOver(key:string): void {
    if(this.isMouseDown && !this.heldKeys.includes(key) && !this.hold) {
      this.service?.keyDown(key);
    }
  }

  mouseOut(key:string): void {
    if(this.isMouseDown && this.heldKeys.includes(key)) {
      this.service?.keyUp(key);
    }
  }

  changeOctave(octave:number): void {
    if(this.octaveBase < 0) this.octaveBase = 4;
    if(this.octaveBase > 4) this.octaveBase = -1;
    this.octaveBase = this.octaveBase + octave;
    this.octaves = [this.octaveBase + 1, this.octaveBase + 2, this.octaveBase + 3]
  }

  ngOnInit(): void {
    this.service?.noteOnEvent.subscribe((note: string): void => {
      this.heldKeys.push(note);
    });
    this.service?.noteOffEvent.subscribe((note: string): void => {
      this.heldKeys = this.heldKeys.filter((element: string): boolean => element != note);
    });
    this.service?.attackReleaseEvent.subscribe((event: any): void => {
      this.heldKeys.push(event.note);
      setTimeout(() => {
        this.heldKeys = this.heldKeys.filter((element: string): boolean => element != event.note);
        this.changeDetectorRef.detectChanges();
      }, Tone.Time(event.duration).toMilliseconds());
      this.changeDetectorRef.detectChanges();
    });
  }

  toggleHold(): void {
    this.hold = !this.hold;
    //if(!this.hold && this.heldKey != "") this.service?.keyUp(this.heldKey);
  }
}
