import { Component } from '@angular/core';
import {InsContextMenuItem} from "../../ui-elements/context-menu/context-menu.component";

@Component({
  selector: 'ins-elements-showcase',
  templateUrl: './elements-showcase.component.html',
  styleUrl: './elements-showcase.component.scss'
})
export class ElementsShowcaseComponent {
  foo: number = 48;
  bar: number = 67;
  barBaz: number = 34;
  pan: number = -34;
  adsr: any = {
    attack: 30,
    decay: 25,
    sustain: 70,
    release: 45
  }

  contextMenuItemClick(item: InsContextMenuItem): void {
    console.log(item);
  }
}
