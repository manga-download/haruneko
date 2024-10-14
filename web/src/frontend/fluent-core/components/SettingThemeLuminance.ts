import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css } from '@microsoft/fast-element';
import { webLightTheme, webDarkTheme } from '@fluentui/tokens';
import { setTheme } from '@fluentui/web-components';
import { StateManagerService, type StateManager } from '../services/StateManagerService';

import IconSunlight from '@fluentui/svg-icons/icons/weather_sunny_20_regular.svg?raw';
import IconMoonlight from '@fluentui/svg-icons/icons/weather_moon_20_regular.svg?raw';

const styles: ElementStyles = css`
    :host {
        padding: calc(var(--base-height-multiplier) * 1px);
        gap: calc(var(--base-height-multiplier) * 1px);
        display: grid;
        align-items: center;
        grid-template-columns: min-content minmax(0, 1fr) min-content;
    }
    #slider {
        display: block;
    }
`;

const template: ViewTemplate<SettingThemeLuminance> = html`
    <fluent-button appearance="transparent" :innerHTML=${() => IconMoonlight} @click=${() => setTheme(webDarkTheme)}></fluent-button>
    <!--
    <fluent-slider id="slider" min="0" max="1" step="0.01" :valueAsNumber=${model => model.S.SettingThemeLuminance} @change=${(model, ctx) => model.S.SettingThemeLuminance = ctx.event.currentTarget['valueAsNumber']}>
        <fluent-slider-label position="0.00"></fluent-slider-label>
        <fluent-slider-label position="0.25"></fluent-slider-label>
        <fluent-slider-label position="0.50"></fluent-slider-label>
        <fluent-slider-label position="0.75"></fluent-slider-label>
        <fluent-slider-label position="1.00"></fluent-slider-label>
    </fluent-slider>
    -->
    <fluent-button appearance="transparent" :innerHTML=${() => IconSunlight} @click=${() => setTheme(webLightTheme)}></fluent-button>
`;

@customElement({ name: 'fluent-setting-theme-luminance', template, styles })
export class SettingThemeLuminance extends FASTElement {
    @StateManagerService S: StateManager;
}