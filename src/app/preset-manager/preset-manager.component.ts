import { Component } from '@angular/core';
import {AppService} from "../app.service";
import {SynthService} from "../synth.service";

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
  showPresetSaveDialog: boolean = false;

  constructor(public appService: AppService, private synthService: SynthService) {
    this.loadPreset('init')
  }

  showSaveDialog(): void {
    this.showPresetSaveDialog = true;
    this.newPresetName = this.currentPreset?.name || '';
    this.synthService.keyboardDisabled = true;
  }

  hideSaveDialog(): void {
    this.showPresetSaveDialog = false;
    this.synthService.keyboardDisabled = false;
  }

  savePreset(): void {
    this.appService.savePreset('', this.newPresetName, {components: {}});
    this.hideSaveDialog();
  }

  loadPreset(presetId: string): void {
    this.currentPreset = this.appService.loadPreset(presetId);
    console.log(this.currentPreset);
  }

  togglePresetList(): void {
    this.showPresetList = !this.showPresetList;
  }

}
