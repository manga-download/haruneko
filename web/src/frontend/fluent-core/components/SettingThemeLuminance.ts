import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css } from '@microsoft/fast-element';
import { StateManagerService, type StateManager } from '../services/StateManagerService';

import IconSunlight from '@fluentui/svg-icons/icons/weather_sunny_20_regular.svg?raw';
import IconMoonlight from '@fluentui/svg-icons/icons/weather_moon_20_regular.svg?raw';

const styles: ElementStyles = css`
    :host {
        padding: var(--spacingHorizontalS);
        gap: var(--spacingHorizontalS);
        display: grid;
        align-items: center;
        grid-template-columns: min-content minmax(0, 1fr) min-content;
    }
`;

const template: ViewTemplate<SettingThemeLuminance> = html`
    <fluent-button appearance="transparent" :innerHTML=${() => IconMoonlight} @click=${model => model.S.SettingSelectedTheme.key = 'web-dark'}></fluent-button>
    <fluent-button appearance="transparent" :innerHTML=${() => IconSunlight} @click=${model => model.S.SettingSelectedTheme.key = 'web-light'}></fluent-button>
`;

@customElement({ name: 'fluent-setting-theme-luminance', template, styles })
export class SettingThemeLuminance extends FASTElement {
    @StateManagerService S: StateManager;
}