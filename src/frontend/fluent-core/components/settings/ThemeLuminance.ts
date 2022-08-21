import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable } from '@microsoft/fast-element';
//import type { DesignTokenSubscriber, DesignToken } from '@microsoft/fast-foundation';
import { baseLayerLuminance, StandardLuminance } from '@fluentui/web-components';

import IconSunlight from '@fluentui/svg-icons/icons/weather_sunny_20_regular.svg?raw';
import IconMoonlight from '@fluentui/svg-icons/icons/weather_moon_20_regular.svg?raw';

const styles: ElementStyles = css`
    :host {
        gap: 4px;
        display: grid;
        align-items: center;
        grid-template-columns: max-content auto max-content;
    }
    #slider {
        width: 100%;
    }
`;

const template: ViewTemplate<ThemeLuminance> = html`
    <fluent-button appearance="stealth" @click=${model => model.luminance = StandardLuminance.DarkMode}>${IconMoonlight}</fluent-button>
    <div><fluent-slider id="slider" min="0" max="1" step="0.01" :valueAsNumber=${model => model.luminance} @change=${(model, ctx) => model.luminance = ctx.event.currentTarget['valueAsNumber']}>
        <fluent-slider-label position="0.00"></fluent-slider-label>
        <fluent-slider-label position="0.25"></fluent-slider-label>
        <fluent-slider-label position="0.50"></fluent-slider-label>
        <fluent-slider-label position="0.75"></fluent-slider-label>
        <fluent-slider-label position="1.00"></fluent-slider-label>
    </fluent-slider></div>
    <fluent-button appearance="stealth" @click=${model => model.luminance = StandardLuminance.LightMode}>${IconSunlight}</fluent-button>
`;

@customElement({ name: 'fluent-setting-theme-luminance', template, styles })
export class ThemeLuminance extends FASTElement {

    constructor() {
        super();
        baseLayerLuminance.subscribe({
            handleChange: record => this.luminance = record.token.getValueFor(record.target)
        });
    }

    @observable luminance: number = StandardLuminance.LightMode;
    luminanceChanged(previous: number, current: number) {
        if(previous !== current) {
            baseLayerLuminance.setValueFor(document.body, current);
        }
    }
}