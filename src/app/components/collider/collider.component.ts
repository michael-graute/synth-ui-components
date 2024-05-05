import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ScaleBuilderService} from "../scale-builder/scale-builder.service";
import * as Tone from 'tone';
import {SynthService} from "../../synth.service";

export type InsCollider = {
  x: number, y: number, dx: number, dy: number, id: string
}

export const initialColliders: InsCollider[] = [
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
  },
  {
    id: '3',
    x: 15,
    y: 12,
    dx: -1,
    dy: -1
  },
  {
    id: '4',
    x: 7,
    y: 4,
    dx: -1,
    dy: -1
  }
]

@Component({
  selector: 'ins-collider',
  templateUrl: './collider.component.html',
  styleUrl: './collider.component.scss'
})
export class ColliderComponent implements OnInit {

  public matrix: any[] = [];
  public collisions: InsCollider[] = [];
  public points: InsCollider[] = JSON.parse(JSON.stringify(initialColliders));

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
  }

  play() {
    this.loop = new Tone.Loop((time) => {
      this.collisions = [];
      this.points.forEach(point => {
        this.changeDetectorRef.detectChanges();
        point.x = point.x + point.dx;
        point.y = point.y + point.dy;
        if (point.x + point.dx > 15 || point.x + point.dx < 0) {
          this.playNote(this.matrix[point.x][point.y], time);
          this.collisions?.push(point);
          point.dx = -point.dx;
        }

        if (point.y + point.dy > 15 || point.y + point.dy < 0) {
          this.playNote(this.matrix[point.x][point.y], time);
          this.collisions?.push(point);
          point.dy = -point.dy;
        }

        if(this.collision(point)) {
          this.playNote(this.matrix[point.x][point.y], time);
          this.collisions?.push(point);
          point.dx = -point.dx;
          point.dy = -point.dy;
        }
      });
    }, '2n');
    this.loop.start();
    Tone.Transport.start();
  }

  playNote(note: string, time: number) {
    if(note) {
      this.synthService.attackRelease({
        note: note,
        duration: '8n',
        velocity: 1,
        time: time
      });
    }
  }

  stop(): void {
    this.loop?.stop();
    Tone.getTransport().stop();
    this.points = JSON.parse(JSON.stringify(initialColliders));
    this.collisions = [];
    this.changeDetectorRef.detectChanges();
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

  isColliding(x: number, y: number): boolean {
    if(this.collisions.length > 0) {
      return this.collisions?.findIndex(point => point.x === x && point.y === y) > -1;
    }
    return false;
  }
}
