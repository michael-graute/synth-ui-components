import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {InsContextMenuConfig, InsContextMenuItem} from "../context-menu/context-menu.component";

@Component({
  selector: 'ins-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.scss'
})
export class MenuButtonComponent {
  @Input() contextMenu: InsContextMenuConfig = {items: []}
  @Input() icon: string|null = null;
  @Input() title: string|null = null;
  @Output() menuItemClick: EventEmitter<InsContextMenuItem> = new EventEmitter<InsContextMenuItem>();

  public isOpen: boolean = false;
  private _insideClick: boolean = false;

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
  }

  onMenuItemClick(menuItem: InsContextMenuItem): void {
    this.toggleOpen();
    this.menuItemClick.emit(menuItem);
  }

  @HostListener('document:keydown', ['$event'])
  documentKeyDown(evt: KeyboardEvent): void {
    if(evt.key === 'Escape' && this.isOpen) {
      this.toggleOpen();
    }
  }

  @HostListener('click')
  clicked(): void {
    this._insideClick = true;
  }

  @HostListener('document:click')
  documentClick(): void{
    if(!this._insideClick && this.isOpen) {
      this.toggleOpen();
    }
    this._insideClick = false;
  }
}
