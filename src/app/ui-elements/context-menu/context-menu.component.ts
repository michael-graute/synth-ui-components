import {Component, EventEmitter, Input, Output} from '@angular/core';

export type InsContextMenuItem = {
  id: string,
  label: string,
  value?: any,
  callback?: any
}

export type InsContextMenuConfig = {
  items: InsContextMenuItem[]
}

@Component({
  selector: 'ins-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss'
})
export class ContextMenuComponent {
  @Output() itemClick: EventEmitter<InsContextMenuItem> = new EventEmitter<InsContextMenuItem>()
  @Input() config: InsContextMenuConfig = {
    items: []
  }


  menuItemClick(menuItem: InsContextMenuItem): void {
    this.itemClick.emit(menuItem);
  }
}
