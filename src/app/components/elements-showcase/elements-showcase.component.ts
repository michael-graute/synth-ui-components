import { Component } from '@angular/core';
import {InsContextMenuItem} from "../../ui-elements/context-menu/context-menu.component";
import { DividerComponent } from '../../ui-elements/divider/divider.component';
import { SliderComponent } from '../../ui-elements/slider/slider.component';
import { FormsModule } from '@angular/forms';
import { HorizontalRangeSliderComponent } from '../../ui-elements/horizontal-range-slider/horizontal-range-slider.component';
import { KnobComponent } from '../../ui-elements/knob/knob.component';
import { SwitchComponent } from '../../ui-elements/switch/switch.component';
import { ButtonGroupComponent } from '../../ui-elements/button-group/button-group.component';
import { WaveformSelectComponent } from '../../ui-elements/waveform-select/waveform-select.component';
import { SelectComponent } from '../../ui-elements/select/select.component';
import { TransportControlComponent } from '../../ui-elements/transport-control/transport-control.component';
import { MenuButtonComponent } from '../../ui-elements/menu-button/menu-button.component';
import { AdsrEnvelopeComponent } from '../../ui-elements/adsr-envelope/adsr-envelope.component';

@Component({
    selector: 'ins-elements-showcase',
    templateUrl: './elements-showcase.component.html',
    styleUrl: './elements-showcase.component.scss',
    standalone: true,
    imports: [DividerComponent, SliderComponent, FormsModule, HorizontalRangeSliderComponent, KnobComponent, SwitchComponent, ButtonGroupComponent, WaveformSelectComponent, SelectComponent, TransportControlComponent, MenuButtonComponent, AdsrEnvelopeComponent]
})
export class ElementsShowcaseComponent {
  foo: number = 48;
  bar: number = 67;
  barBaz: number = 34;
  pan: number = -34;
  adsr: any = {
    attack: 30,
    decay: 25,
    sustain: 70,
    release: 45
  }

  contextMenuItemClick(item: InsContextMenuItem): void {
    console.log(item);
  }
}
