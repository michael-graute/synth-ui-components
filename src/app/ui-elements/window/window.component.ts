import {Component, Input, OnInit} from '@angular/core';
import {WindowService} from "./window.service";
import { NgClass } from '@angular/common';

@Component({
    selector: 'ins-window',
    templateUrl: './window.component.html',
    styleUrl: './window.component.scss',
    standalone: true,
    imports: [NgClass]
})
export class WindowComponent implements OnInit{

  @Input() id?: string;
  @Input() title?: string;
  isOpen = false;
  private element: any;

  constructor(private windowService: WindowService) {
  }

  ngOnInit(): void {
    this.windowService.add(this);
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

}
