import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css } from '@microsoft/fast-element';
import { StandardLuminance } from '@fluentui/web-components';
import S from '../services/StateService';

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
    <fluent-button appearance="stealth" @click=${() => S.SettingThemeLuminance = StandardLuminance.DarkMode}>${IconMoonlight}</fluent-button>
    <fluent-slider id="slider" min="0" max="1" step="0.01" :valueAsNumber=${() => S.SettingThemeLuminance} @change=${(_, ctx) => S.SettingThemeLuminance = ctx.event.currentTarget['valueAsNumber']}>
        <fluent-slider-label position="0.00"></fluent-slider-label>
        <fluent-slider-label position="0.25"></fluent-slider-label>
        <fluent-slider-label position="0.50"></fluent-slider-label>
        <fluent-slider-label position="0.75"></fluent-slider-label>
        <fluent-slider-label position="1.00"></fluent-slider-label>
    </fluent-slider>
    <fluent-button appearance="stealth" @click=${() => S.SettingThemeLuminance = StandardLuminance.LightMode}>${IconSunlight}</fluent-button>
`;

@customElement({ name: 'fluent-setting-theme-luminance', template, styles })
export class SettingThemeLuminance extends FASTElement {}