import { Component } from '@angular/core';
import {UndoManagerService} from "./undo-manager.service";

@Component({
    selector: 'ins-undo-manager',
    templateUrl: './undo-manager.component.html',
    styleUrl: './undo-manager.component.scss',
    standalone: true
})
export class UndoManagerComponent {

  constructor(public undoManagerService: UndoManagerService) {
  }

  undoLastAction(): void {
    this.undoManagerService.undo();
  }

}
