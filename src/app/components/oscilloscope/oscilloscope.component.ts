import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import * as Tone from "tone";
import {TransportClass} from "tone/build/esm/core/clock/Transport";
import { ButtonGroupComponent } from '../../ui-elements/button-group/button-group.component';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'ins-oscilloscope',
    templateUrl: './oscilloscope.component.html',
    styleUrls: ['./oscilloscope.component.scss'],
    standalone: true,
    imports: [ButtonGroupComponent, FormsModule]
})
export class OscilloscopeComponent implements AfterViewInit {
  @ViewChild('canvasElement', {static: true}) canvasElement: any;

  @Input() synth: any = new Tone.Synth();
  public fft = new Tone.FFT({size: 512}).toDestination();
  public analyser = new Tone.Analyser('waveform', 512);
  private interval: any;
  public isPlaying = false;
  private transport?: TransportClass;
  private transportScheduledRepeatId?: number;
  public type: "scope" | "graph" = 'scope';

  public constructor() {

  }

  ngAfterViewInit(): void {
    this.synth.connect(this.fft);
    this.synth.connect(this.analyser);
    this.transport = Tone.getTransport();
    this.transportScheduledRepeatId = this.transport?.scheduleRepeat((time: any) => {
      this.draw();
    }, this.analyser.blockTime);
    this.transport?.start();
    //const canvas = this.canvasElement.nativeElement;
    //const canvasContext = canvas.getContext('2d');
    //canvasContext.fillStyle = 'red';
    //canvasContext.fillRect(0, canvas.height, 10, -500);
    }

  /*toneStart() {
    Tone.start().then(() => {
      console.log('audio is ready');
    });
  }

  play() {
    this.synth.oscillator.type = 'square';
    //this.synth.volume
    this.synth.triggerAttack("C4", "8n", 1);
    this.transportScheduledRepeatId = this.transport?.scheduleRepeat((time) => {
      this.draw();
    }, this.analyser.blockTime);
    this.transport?.start();
  }

  stop() {
    this.synth.triggerRelease();
    this.isPlaying = false;
    this.transport?.stop();
    this.transport?.clear(this.transportScheduledRepeatId || 0);
    const canvas = this.canvasElement.nativeElement;
    const canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  }*/


  draw() {
    const canvas = this.canvasElement.nativeElement;
    const canvasContext = canvas.getContext('2d');
    // @ts-ignore
    if(this.type === 'scope') {
      const data: Float32Array = this.analyser.getValue() as Float32Array;
      //console.log(data[0]);
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      canvasContext.strokeStyle = '#00a4e1';
      canvasContext.lineWidth = 2;
      canvasContext.moveTo(-100, canvas.height / 2);
      canvasContext.beginPath();
      //data.forEach((v: number, index: number): void => {
      for (let i = 0; i < data.length; i++) {
        const y = (data[i] / this.analyser.blockTime) + canvas.height / 2;
        //console.log(data[i], data[i] / this.analyser.blockTime, y);
        canvasContext.lineTo(i * (canvas.width / data.length), y);
      }
      canvasContext.stroke();
      canvasContext.closePath();
    } else {
      const data: Float32Array = this.fft.getValue() as Float32Array;
      canvasContext.fillStyle = '#00a4e1';
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      //data.forEach((v: number, index: number): void => {
      for(let i= 0; i < data.length; i++) {
        canvasContext.fillRect(i * 3, canvas.height, 2, data[i]);
      }
    }
    /*this.fft.getValue().forEach((v: number, index: number): void => {
      console.log(-v + canvas.height / 2);
      canvasContext.lineTo(index * 3, -v + canvas.height / 2);
      //canvasContext.lineTo(index * 3, v * 1000 + canvas.height / 2);
    });
    this.fft.getValue().forEach((v: number, index: number): void => {*/
    //console.log(this.fft.getValue().map((v: number, index ) => this.fft.getFrequencyOfIndex(index)));
    /*//if(this.isPlaying) {
      canvasContext.clearRect(0, 0, canvas.width, canvas.height);
      //console.log(this.fft.getValue()); // This is the value you want to use in your
      const value = this.fft.getValue();
      const segmentWidth = canvas.width / value.length;
      //canvasContext.fillRect(0, 0, canvas.width, canvas.height);
      canvasContext.beginPath();
      canvasContext.moveTo(-100, canvas.height / 2);
      for (let i = 0; i < value.length; i++) {
        //canvasContext.fillStyle = '#00a4e1';
        //canvasContext.fillRect(i * 3, canvas.height, 2, value[i]);
        let x = i * segmentWidth;
        let v = this.fft.getFrequencyOfIndex(i) * -value[i];
        let y = this.fft.getFrequencyOfIndex(i) / value.length; //(v/1000000 * canvas.height) / 2;
        canvasContext.lineTo(x, y);
        //console.log('x', x);
        console.log('y', y);
        //console.log('segmentWidth', segmentWidth);
        console.log(this.fft.getFrequencyOfIndex(i) / value.length);
        //console.log('value', value[i]);
        //console.log('freq', this.fft.getFrequencyOfIndex(i));
      }*/

    //}
    //canvasContext.lineTo(canvas.width + 100, canvas.height / 2);
    //requestAnimationFrame(() => this.draw());
  }

}
