import {Component, OnInit} from '@angular/core';
import {ScaleBuilderService} from "../scale-builder/scale-builder.service";

@Component({
  selector: 'ins-collider',
  templateUrl: './collider.component.html',
  styleUrl: './collider.component.scss'
})
export class ColliderComponent implements OnInit {

  public matrix: any[] = []

  constructor(private scaleBuilderService: ScaleBuilderService) {
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
}
