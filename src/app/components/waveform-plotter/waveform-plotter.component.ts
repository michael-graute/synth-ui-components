import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
    selector: 'ins-waveform-plotter',
    templateUrl: './waveform-plotter.component.html',
    styleUrl: './waveform-plotter.component.scss',
    standalone: true
})
export class WaveformPlotterComponent implements AfterViewInit {

  @ViewChild('waveformCanvas') waveformCanvas: ElementRef<HTMLCanvasElement> | undefined;

  ngAfterViewInit(): void {
    this.plotSine();
  }

  plotSine() {
    if (!this.waveformCanvas) {
      //console.log('foo');
      return;
    }
    const ctx = this.waveformCanvas.nativeElement.getContext("2d");
    if (ctx) {
      const width = ctx.canvas.width || 0;
      const height = ctx.canvas.height || 0
      const scale = 20;
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "gray";
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#00a4e1";

      let x = 0;
      let y = 0;
      const attack = 70;
      const attackWidth = width/100 * attack;
      let amplitude = height/2;
      const amplitudeRamp = amplitude/attackWidth;
      const sustain = 30;
      const frequency = 10;
      //ctx.moveTo(x, y);
      while (x < width) {
        if(x < attackWidth && x > 0) {
         amplitude = amplitude + amplitudeRamp;
        } else {
          amplitude = sustain;
        }
        y = height / 2 + amplitude * Math.sin(x / frequency);
        ctx.lineTo(x, y);
        x = x + 1;
      }
      ctx.stroke();
      ctx.closePath();
    }
  }
}
