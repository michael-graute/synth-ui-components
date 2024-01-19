import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

export type InsPreset = {
  id: string,
  name: string,
  tags: string[],
  components: {[id: string]: any},
}

@Injectable({
  providedIn: 'root'
})
export class AppService {

  loadConfigEvent: Subject<any> = new Subject<any>();
  saveConfigEvent: Subject<any> = new Subject<any>();

  constructor() { }


  loadPreset(presetId: string) {
    const presetConfigString = localStorage.getItem(presetId);
    if(presetConfigString) {
      const presetConfig = JSON.parse(presetConfigString);
      console.log(presetConfig);
      this.loadConfigEvent.next(presetConfig);
    }
  }

  savePreset(presetId: string, config: any) {
    const presetConfigString = localStorage.getItem(presetId);
    if(!presetConfigString) {
      localStorage.setItem(presetId, JSON.stringify(config));
    }
    this.saveConfigEvent.next(presetId);
  }
}
