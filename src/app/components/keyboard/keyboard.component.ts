import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import {InsAttackReleasePayload, InsNoteOnPayload, SynthService} from "../../synth.service";
import * as Tone from "tone";
import { NgClass, NgFor, NgIf } from '@angular/common';


@Component({
    selector: 'ins-keyboard',
    templateUrl: './keyboard.component.html',
    styleUrls: ['./keyboard.component.scss'],
    standalone: true,
    imports: [NgClass, NgFor, NgIf]
})
export class KeyboardComponent implements OnInit {
  private octaveBase : number = 0;
  public charMap: string[] = ["a","w","s","e","d","f","t","g","z","h","u","j"];
  public notes : string[] = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  public octaves : number[] = [];
  public isMouseDown : boolean = false;
  public heldKeys: string[] = [];
  public hold : boolean = false;

  constructor(private changeDetectorRef: ChangeDetectorRef, private synthService: SynthService) {
    this.changeOctave(2)
  }

  @HostListener('document:mouseup')
  handleDocumentMouseUpEvent(): void {
    this.isMouseDown = false;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDownEvent(event: KeyboardEvent): void {
    if(this.charMap.includes(event.key) && !this.heldKeys.includes(this.notes[this.charMap.findIndex((element: string): boolean => element == event.key)] + (this.octaveBase + 1))) {
      const index: number = this.charMap.findIndex((element: string): boolean => element == event.key);
      const note: string = this.notes[index] + (this.octaveBase + 1);
      this.synthService.keyDown(note);
    }
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyUpEvent(event: KeyboardEvent): void {
    if(this.charMap.includes(event.key)) {
      const index: number = this.charMap.findIndex((element: string): boolean => element == event.key);
      const note: string = this.notes[index] + (this.octaveBase + 1);
      this.synthService.keyUp(note);
    }
  }

  mouseDown(key:string): void {
    this.isMouseDown = true;
    this.synthService.keyDown(key);
  }

  mouseUp(key:string): void{
    if(this.isMouseDown && this.heldKeys.includes(key)) {
      this.synthService.keyUp(key);
      this.isMouseDown = false;
    }
  }

  mouseOver(key:string): void {
    if(this.isMouseDown && !this.heldKeys.includes(key) && !this.hold) {
      this.synthService.keyDown(key);
    }
  }

  mouseOut(key:string): void {
    if(this.isMouseDown && this.heldKeys.includes(key)) {
      this.synthService.keyUp(key);
    }
  }

  changeOctave(octave:number): void {
    if(this.octaveBase < 0) this.octaveBase = 4;
    if(this.octaveBase > 4) this.octaveBase = -1;
    this.octaveBase = this.octaveBase + octave;
    this.octaves = [this.octaveBase + 1, this.octaveBase + 2, this.octaveBase + 3]
  }

  ngOnInit(): void {
    this.synthService.noteOnEvent.subscribe((event: InsNoteOnPayload): void => {
      this.heldKeys.push(event.note);
    });
    this.synthService.noteOffEvent.subscribe((note: string): void => {
      this.heldKeys = this.heldKeys.filter((element: string): boolean => element != note);
    });
    this.synthService.attackReleaseEvent.subscribe((event: InsAttackReleasePayload): void => {
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
    //if(!this.hold && this.heldKey != "") this.synthService.keyUp(this.heldKey);
  }
}
