import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

export interface UndoStep {
  action: string;
  componentId: string;
  propertyName: string;
  oldValue: any;
  newValue: any;
}

@Injectable({
  providedIn: 'root'
})
export class UndoManagerService {

  undoEvent: Subject<UndoStep> = new Subject<UndoStep>();
  undSteps: UndoStep[] = [];
  maxSteps: number = 100;

  constructor() { }

  addUndoStep(action: string, componentId: string, propertyName: string, oldValue: any, newValue: any): void {
    const undoStep: UndoStep = {
      action: action,
      componentId: componentId,
      propertyName: propertyName,
      oldValue: oldValue,
      newValue: newValue
    }
    this.undSteps.push(undoStep);
    if(this.undSteps.length > this.maxSteps) {
      this.undSteps.shift();
    }
    console.log(this.undSteps);
  }

  undo(): void {
    const step: UndoStep | undefined = this.undSteps.pop();
    if(step) {
      this.undoEvent.next(step);
    }
  }
}
