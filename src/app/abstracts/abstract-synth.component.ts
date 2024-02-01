import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import {Subscription} from "rxjs";
import {SynthService} from "../synth.service";
import {PresetManagerService, InsPreset} from "../preset-manager/preset-manager.service";

@Component({
  template: '',
})
export class AbstractSynthComponent<T> implements OnInit, OnDestroy {

  @Input() id: string = uuidv4();
  public config: T | null = null;
  protected subscriptions: Subscription = new Subscription();

  constructor(protected presetManagerService: PresetManagerService, protected synthService: SynthService) {}

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

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
