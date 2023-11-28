import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'ins-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements AfterViewInit {
  @Input() value: number = 5;
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

  private mouseDown: boolean = false;
  private mouseDownStartY: number = 0;
  public editMode: boolean = false;
  private tmpValue: number = 0;


  public draw() {
    const canvas = this.slider?.nativeElement;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = this.baseColor;
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.fillStyle = this.valueColor;
      ctx.fillRect(0, this.height - (this.value - this.min) / (this.max - this.min) * this.height, this.width, (this.value - this.min) / (this.max - this.min) * this.height);
    }
  }

  @HostListener('mousedown', ['$event'])
  handleMouseDown(event: MouseEvent) {
    this.mouseDown = true;
    this.mouseDownStartY = event.clientY;
    const delta = event.clientY - this.mouseDownStartY;
    const deltaValue = delta / this.height * (this.max - this.min);
    this.value = Math.min(Math.max(this.value - deltaValue, this.min), this.max);
    this.draw();
  }

  @HostListener('mouseup', ['$event'])
  handleMouseUp(event: MouseEvent) {
    this.mouseDown = false;
  }

  @HostListener('mouseout', ['$event'])
  handleMouseOut(event: MouseEvent) {
    this.mouseDown = false;
  }

  @HostListener('mousemove', ['$event'])
  handleMouseMove(event: MouseEvent) {
    if (!this.mouseDown) {
      return;
    }

    const delta = event.clientY - this.mouseDownStartY;
    const deltaValue = delta / this.height * (this.max - this.min);
    this.value = Math.min(Math.max(this.value - deltaValue, this.min), this.max);
    this.mouseDownStartY = event.clientY;
    this.draw();
  }

  @HostListener('dblclick', ['$event'])
  handleDoubleClick(event: MouseEvent) {
    this.editMode = true;
    setTimeout(() => {
      if(!this.sliderEditorInput) return;
      this.sliderEditorInput.nativeElement.value = this.value;
      this.sliderEditorInput.nativeElement.focus();
    }, 100);
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent) {
    if(!this.sliderEditorInput) return;
    if(event.target !== this.sliderEditorInput.nativeElement) {
      this.editMode = false;
    }
  }

  handleEditorKeyDown(event: KeyboardEvent) {
    if(event.key === 'Enter') {
      this.editMode = false;
    } else if(event.key === 'Escape') {
      this.editMode = false;
    }
  }

  ngAfterViewInit(): void {
    this.draw();
  }

}
