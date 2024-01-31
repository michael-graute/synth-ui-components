import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {v4 as uuidv4} from 'uuid';

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
  availablePresets: any[] = [];

  constructor() {
    this.availablePresets = this.getAvailablePresets();
  }

  getAvailablePresets(): any[] {
    const presetString: string | null = localStorage.getItem('InsPresets');
    return presetString ? JSON.parse(presetString) : [];
  }

  loadPreset(presetId: string): InsPreset | undefined {
    const presetConfigString: string | null = localStorage.getItem('InsPreset-' + presetId);
    const presetInfo: any = this.availablePresets.find((preset: any) => preset.id === presetId);
    if(presetConfigString && presetInfo) {
      const presetConfig = JSON.parse(presetConfigString);
      const preset: InsPreset = {
        id: presetInfo.id,
        name: presetInfo.name,
        tags: presetInfo.tags,
        components: presetConfig.components
      }
      this.loadConfigEvent.next(presetConfig);
      return preset;
    }
    return undefined;
  }

  savePreset(presetId: string, name: string, config: any): void {
    let presetInfo: any = this.availablePresets.find((preset: any) => preset.id === presetId);
    if(!presetInfo) {
      presetInfo = {
        id: uuidv4(),
        name: name,
        tags: [],
      }
      this.availablePresets.push(presetInfo);
      localStorage.setItem('InsPresets', JSON.stringify(this.availablePresets));
      console.log(presetInfo);
      console.log(this.availablePresets);
    }
    localStorage.setItem('InsPreset-' + presetInfo.id, JSON.stringify(config));
    this.saveConfigEvent.next('InsPreset-' + presetInfo.id);
  }
}
