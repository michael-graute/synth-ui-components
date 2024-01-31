import { Component } from '@angular/core';
import {AppService} from "../app.service";

export type InsPreset = {
  id: string,
  name: string,
  tags: string[],
  components: {[id: string]: any},
}

@Component({
  selector: 'ins-preset-manager',
  templateUrl: './preset-manager.component.html',
  styleUrl: './preset-manager.component.scss'
})
export class PresetManagerComponent {

  newPresetName: string = '';
  currentPreset: InsPreset | undefined;
  showPresetList: boolean = false;

  constructor(public appService: AppService) {
    this.loadPreset('init')
  }

  savePreset(): void {
    this.appService.savePreset('', this.newPresetName, {components: {}})
  }

  loadPreset(presetId: string): void {
    this.currentPreset = this.appService.loadPreset(presetId);
    console.log(this.currentPreset);
  }

  togglePresetList(): void {
    this.showPresetList = !this.showPresetList;
  }

}
