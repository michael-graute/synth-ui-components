import {Component, OnInit} from '@angular/core';
import {SynthService} from "./synth.service";

@Component({
  selector: 'ins-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public page: string = 'main';

  constructor(public synthService: SynthService) {
  }

  ngOnInit(): void {
  }

}
