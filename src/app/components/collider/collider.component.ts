import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {ScaleBuilderService} from "../scale-builder/scale-builder.service";
import * as Tone from 'tone';
import {SynthService} from "../../synth.service";
import {v4 as uuidv4} from "uuid";
import {getRandomInt} from "../../utils";

export type InsCollider = {
  x: number, y: number, dx: number, dy: number, id: string
}

@Component({
  selector: 'ins-collider',
  templateUrl: './collider.component.html',
  styleUrl: './collider.component.scss'
})
export class ColliderComponent implements OnInit {

  @Input() matrixSize: number = 16;
  public matrix: any[] = [];
  public collisions: InsCollider[] = [];
  public colliders: InsCollider[] = [];
  public tempo: string = '2n';
  public loop: Tone.Loop | undefined;
  public colliderAmount: number = 4;

  constructor(private synthService: SynthService, private scaleBuilderService: ScaleBuilderService, private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.buildMatrix();
    this.initializeColliders();
    console.log(this.colliders);
  }

  buildMatrix() {
    for(let i = 0; i < this.matrixSize; i++) {
      this.matrix.push(this.scaleBuilderService.getRandomizedNotesForScale('natural-minor', 'C', 1, 2, this.matrixSize));
    }
  }

  initializeColliders() {
    this.colliders = [];
    for(let i = 0; i < this.colliderAmount; i++) {
      this.addCollider();
    }
  }

  addCollider() {
    const collider: InsCollider = {
      id: uuidv4(),
      x: getRandomInt(1,this.matrixSize-2),
      y: getRandomInt(1,this.matrixSize-2),
      dx: -1,
      dy: -1
    }
    this.colliders.push(collider);
  }

  removeCollider(): void {
    this.colliders.pop();
  }

  play() {
    this.loop = new Tone.Loop((time) => {
      this.collisions = [];
      this.colliders.forEach(point => {
        this.changeDetectorRef.detectChanges();
        point.x = point.x + point.dx;
        point.y = point.y + point.dy;
        if (point.x + point.dx > this.matrixSize-1 || point.x + point.dx < 0) {
          this.playNote(this.matrix[point.x][point.y], time);
          this.collisions?.push(point);
          point.dx = -point.dx;
        }

        if (point.y + point.dy > this.matrixSize-1 || point.y + point.dy < 0) {
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
    }, this.tempo);
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
    this.initializeColliders();
    this.collisions = [];
    this.changeDetectorRef.detectChanges();
  }

  pause(): void {
    this.loop?.stop();
    Tone.getTransport().stop();
  }

  hasCollider(x: number, y: number) {
    return this.colliders.findIndex(point => point.x === x && point.y === y) > -1;
  }

  collision(currentPoint: InsCollider) {
    return this.colliders.findIndex(point => point.x === currentPoint.x && point.y === currentPoint.y && point.id !== currentPoint.id) > -1;
  }

  isColliding(x: number, y: number): boolean {
    if(this.collisions.length > 0) {
      return this.collisions?.findIndex(point => point.x === x && point.y === y) > -1;
    }
    return false;
  }
}
