import {Component, Input, OnInit} from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import {AppService, InsPreset} from "../app.service";

@Component({
  template: '',
})
export class AbstractSynthComponent<T = any> implements OnInit {

  @Input() id: string = uuidv4();
  public config: any = null;

  constructor(private appService: AppService) {
    this.appService.loadConfigEvent.subscribe((preset: InsPreset) => {
      this.loadConfig(preset);
    });
    this.appService.saveConfigEvent.subscribe((presetId: string) => {
      this.saveConfig(presetId);
    });
  }

  ngOnInit() {
    this.appService.saveConfigEvent.subscribe((presetId: string) => {
      console.log('saveConfigEvent', this.config);
    });
  }

  loadConfig(preset: InsPreset) {
    this.config = preset.components[this.id];
  }

  saveConfig(presetId: string) {
    const preset = localStorage.getItem(presetId);
    if(preset) {
      let presetConfig = JSON.parse(preset);
      presetConfig.components[this.id] = this.config;
      localStorage.setItem(presetId, JSON.stringify(presetConfig));
    }
  }

}
