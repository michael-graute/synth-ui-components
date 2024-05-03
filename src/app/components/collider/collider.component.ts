import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ScaleBuilderService} from "../scale-builder/scale-builder.service";
import * as Tone from 'tone';
import {SynthService} from "../../synth.service";

export type InsCollider = {
  x: number, y: number, dx: number, dy: number, id: string
}

@Component({
  selector: 'ins-collider',
  templateUrl: './collider.component.html',
  styleUrl: './collider.component.scss'
})
export class ColliderComponent implements OnInit {

  public matrix: any[] = []
  public points: InsCollider[] = [
    {
      id: '1',
      x: 4,
      y: 1,
      dx: 1,
      dy: 2
    },
    {
      id: '2',
      x: 9,
      y: 1,
      dx: -1,
      dy: -1
    }
  ]

  public loop: Tone.Loop | undefined;

  constructor(private synthService: SynthService, private scaleBuilderService: ScaleBuilderService, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.buildMatrix();
  }

  buildMatrix(size: number = 16) {
    for(let i = 0; i < size; i++) {
      this.matrix.push(this.scaleBuilderService.getRandomizedNotesForScale('natural-minor', 'C', 1, 2, size));
    }
    console.log(this.matrix);
  }

  play() {
    this.loop = new Tone.Loop((time) => {
      this.points.forEach(point => {
        point.x = point.x + point.dx;
        point.y = point.y + point.dy;
        if (point.x + point.dx > 15 || point.x + point.dx < 0) {
          this.playNote(this.matrix[point.x][point.y], time);
          point.dx = -point.dx;
        }

        if (point.y + point.dy > 15 || point.y + point.dy < 0) {
          this.playNote(this.matrix[point.x][point.y], time);
          point.dy = -point.dy;
        }

        if(this.collision(point)) {
          this.playNote(this.matrix[point.x][point.y], time);
          point.dx = -point.dx;
          point.dy = -point.dy;
        }

      });
      this.changeDetectorRef.detectChanges();
    }, '8n');
    this.loop.start();
    Tone.Transport.start();
  }

  playNote(note: string, time: number) {
    this.synthService.attackRelease({
      note: note,
      duration: '8n',
      velocity: 1,
      time: time
    });
  }

  stop(): void {
    this.loop?.stop();
    Tone.getTransport().stop();
    this.points = [
      {
        id: '1',
        x: 4,
        y: 1,
        dx: 1,
        dy: 1
      },
      {
        id: '2',
        x: 9,
        y: 1,
        dx: -1,
        dy: -1
      }
    ]
  }

  pause(): void {
    this.loop?.stop();
    Tone.getTransport().stop();
  }

  hasCollider(x: number, y: number) {
    return this.points.findIndex(point => point.x === x && point.y === y) > -1;
  }

  collision(currentPoint: InsCollider) {
    return this.points.findIndex(point => point.x === currentPoint.x && point.y === currentPoint.y && point.id !== currentPoint.id) > -1;
  }

}
