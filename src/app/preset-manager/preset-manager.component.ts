import { Component } from '@angular/core';
import {SynthService} from "../synth.service";
import {PresetManagerService} from "./preset-manager.service";

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

  constructor(public presetManagerService: PresetManagerService, private synthService: SynthService) {
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
    this.presetManagerService.savePreset('', this.newPresetName, {components: {}});
    this.hideSaveDialog();
  }

  loadPreset(presetId: string): void {
    this.currentPreset = this.presetManagerService.loadPreset(presetId);
  }

  togglePresetList(): void {
    this.showPresetList = !this.showPresetList;
  }

}
