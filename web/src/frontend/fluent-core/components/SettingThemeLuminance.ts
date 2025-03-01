import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css } from '@microsoft/fast-element';
import { StateManagerService, type StateManager, ThemeWebLight, ThemeWebDark} from '../services/StateManagerService';

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
    <fluent-button icon-only appearance="transparent" :innerHTML=${model => model.GetThemeIcon(model.S.SettingSelectedTheme)} @click=${model => model.S.SettingSelectedTheme = ThemeWebLight}></fluent-button>
    <!--
    <fluent-button icon-only appearance="transparent" :innerHTML=${() => IconMoonlight} @click=${model => model.S.SettingSelectedTheme = ThemeWebDark}></fluent-button>
    -->
`;

@customElement({ name: 'fluent-setting-theme-luminance', template, styles })
export class SettingThemeLuminance extends FASTElement {
    @StateManagerService S: StateManager;
    GetThemeIcon(selectedTheme: unknown) {
        return selectedTheme === ThemeWebLight ? IconSunlight : IconMoonlight;
    }
}