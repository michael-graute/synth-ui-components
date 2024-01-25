import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UndoService {

  constructor() { }

  addUndoStep(componentId: string, oldValue: any, newValue: any) {
    console.log('addUndoStep', componentId, oldValue, newValue);
  }
}
