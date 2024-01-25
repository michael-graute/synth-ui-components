import { Injectable } from '@angular/core';

export interface UndoStep {
  action: string;
  componentId: string;
  oldValue: any;
  newValue: any;
}

@Injectable({
  providedIn: 'root'
})
export class UndoService {

  constructor() { }

  addUndoStep(action: string, componentId: string, oldValue: any, newValue: any) {
    const undoStep: UndoStep = {
      action: action,
      componentId: componentId,
      oldValue: oldValue,
      newValue: newValue
    }
    console.log('addUndoStep', undoStep);
  }
}
