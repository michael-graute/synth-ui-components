import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import {Subscription} from "rxjs";
import {SynthService} from "../synth.service";
import {PresetManagerService, InsPreset} from "../preset-manager/preset-manager.service";
import {UndoManagerService} from "../undo-manager/undo-manager.service";

@Component({
  template: '',
})
export class AbstractSynthComponent<T> implements OnInit, OnDestroy {

  @Input() id: string = uuidv4();
  public config: T | null = null;
  protected subscriptions: Subscription = new Subscription();

  constructor(protected presetManagerService: PresetManagerService, protected synthService: SynthService, protected undoManagerService: UndoManagerService) {}

  ngOnInit(): void {
    this.setPropertiesFromPreset(this.config);
    this.subscriptions.add(this.presetManagerService.saveConfigEvent.subscribe((presetId: string) => {
      this.saveConfig(presetId);
    }));
    this.subscriptions.add(this.presetManagerService.loadConfigEvent.subscribe((preset: InsPreset) => {
      if(preset.components[this.id]) {
        this.setPropertiesFromPreset(preset.components[this.id]);
      }
    }));
  }

  setPropertiesFromPreset(preset: any): void {
    let property: keyof typeof preset;
    for (property in preset) {
      // @ts-ignore
      this[property] = preset[property];
    }
  }

  saveConfig(presetId: string): void {
    const preset = localStorage.getItem(presetId);
    if(preset) {
      let presetConfig = JSON.parse(preset);
      presetConfig.components[this.id] = this.config;
      localStorage.setItem(presetId, JSON.stringify(presetConfig));
    }
  }

  triggerUndo(propertyName: string, value: any): void {
    //this.synthService.undoStack.push({componentId: this.id, propertyName, value});
    // @ts-ignore
    console.log('triggerUndo', this.id, propertyName, value, this.config[propertyName]);
    this.undoManagerService.addUndoStep('valueChange', this.id, propertyName, value.old , value.new);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
