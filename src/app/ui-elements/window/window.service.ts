import { Injectable } from '@angular/core';
import {WindowComponent} from "./window.component";

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  private windows: WindowComponent[] = [];

  add(modal: WindowComponent) {
    // ensure component has a unique id attribute
    if (!modal.id || this.windows.find(x => x.id === modal.id)) {
      throw new Error('modal must have a unique id attribute');
    }

    // add modal to array of active modals
    this.windows.push(modal);
  }

  remove(modal: WindowComponent) {
    // remove modal from array of active modals
    this.windows = this.windows.filter(x => x === modal);
  }

  open(id: string) {
    // open modal specified by id
    const window = this.windows.find(x => x.id === id);

    if (!window) {
      throw new Error(`modal '${id}' not found`);
    }

    window.open();
  }

  close() {
    // close the modal that is currently open
    const window = this.windows.find(x => x.isOpen);
    window?.close();
  }
}
