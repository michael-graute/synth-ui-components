import {AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'ins-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: SliderComponent
    }
  ]
})
export class SliderComponent implements AfterViewInit, ControlValueAccessor {
  private mouseDown: boolean = false;
  private mouseDownStartY: number = 0;
  public editMode: boolean = false;
  private internalValue: number = 0;

  @Input() set value(value: number) {
    this.internalValue = value;
    this.onChange(this.value)
    this.draw();
  }
  @Input() name: string = '';
  @Input() id: string = '';
  @Input() min: number = 0;
  @Input() max: number = 10;
  @Input() step: number = 0.01;
  @Input() label: string = '';
  @Input() width: number = 20;
  @Input() height: number = 150;
  @Input() baseColor: string = 'grey';
  @Input() valueColor: string = '#00a4e1';
  @ViewChild('slider') slider: ElementRef | undefined;
  @ViewChild('sliderEditorInput') sliderEditorInput: ElementRef | undefined;

  get value(): number {
    return Math.round(this.internalValue);
  }

  public writeValue(obj: any): void {
    if(obj === null || obj === undefined) return;
    this.value = obj;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public registerOnTouched(fn: any): void {
    console.log(fn)
  }
  public setDisabledState?(isDisabled: boolean): void {
    console.log(isDisabled);
  }

  public onChange = (value: number): void => {};

  public draw(): void {
    if(!this.slider) return;
    const canvas = this.slider?.nativeElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = this.baseColor;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = this.valueColor;
      ctx.fillRect(0, this.height - (this.internalValue - this.min) / (this.max - this.min) * this.height, this.width, (this.internalValue - this.min) / (this.max - this.min) * this.height);
    }
  }


  @HostListener('mousedown', ['$event'])
  handleMouseDown(event: MouseEvent): void {
    this.mouseDown = true;
    this.mouseDownStartY = event.clientY;
    this.value = Math.min(Math.max(this.internalValue - this.calculateDelta(event), this.min), this.max);
  }

  @HostListener('mouseup')
  handleMouseUp(): void {
    this.mouseDown = false;
  }

  @HostListener('mouseout')
  handleMouseOut(): void {
    this.mouseDown = false;
  }

  @HostListener('mousemove', ['$event'])
  handleMouseMove(event: MouseEvent): void {
    if (!this.mouseDown) return;
    this.value = Math.min(Math.max(this.internalValue - this.calculateDelta(event), this.min), this.max);
    this.mouseDownStartY = event.clientY;
  }

  calculateDelta(event: MouseEvent): number {
    const delta: number = event.clientY - this.mouseDownStartY;
    return delta / this.height * (this.max - this.min);
  }

  @HostListener('dblclick')
  handleDoubleClick(): void {
    this.editMode = true;
    setTimeout((): void => {
      if(!this.sliderEditorInput) return;
      this.sliderEditorInput.nativeElement.value = this.value;
      this.sliderEditorInput.nativeElement.focus();
    }, 100);
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    if(!this.sliderEditorInput) return;
    if(event.target !== this.sliderEditorInput.nativeElement) {
      this.editMode = false;
    }
  }

  handleEditorKeyDown(event: KeyboardEvent): void {
    if(event.key === 'Enter') {
      this.editMode = false;
      if(event.currentTarget) {
        const target: HTMLInputElement = event.currentTarget as HTMLInputElement;
        this.value = target.value === '' || target.value === null ? this.min : target.valueAsNumber;
      }
    } else if(event.key === 'Escape') {
      this.editMode = false;
    }
  }

  ngAfterViewInit(): void {
    this.draw();
  }

}
