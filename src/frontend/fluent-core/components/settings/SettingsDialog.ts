import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat } from '@microsoft/fast-element';
import type { ISetting } from '../../../../engine/SettingsManager';
import S from '../../services/StateService';

const styles: ElementStyles = css`

    :host {
        z-index: 2147483647;
    }

    #dialog {
        height: 100%;
        box-sizing: border-box;
        padding: calc(var(--base-height-multiplier) * 1px);
        gap: calc(var(--base-height-multiplier) * 1px);
        display: grid;
        align-items: start;
        grid-template-columns: auto;
        grid-template-rows: max-content minmax(0, 1fr) max-content;
    }

    #header {
        text-align: center;
    }

    #content {
        gap: calc(var(--base-height-multiplier) * 1px);
        display: grid;
        align-items: center;
        grid-template-columns: max-content minmax(0, 1fr);
        overflow-y: scroll;
        overflow-x: hidden;
    }

    #footer {
        text-align: center;
    }
`;

const templateSettingRow: ViewTemplate<ISetting> = html`
    <div title="${model => S.Locale[model.Description]()}">
        ${model => S.Locale[model.Label]()}
    </div>
    <div>${model => model.Value.toString()}</div>
`;

const template: ViewTemplate<SettingsDialog> = html`
    <fluent-dialog trap-focus modal ?hidden=${model => model.hidden}>
        <div id="dialog">
            <!--
            <fluent-setting-theme-luminance style="width: 100%;"></fluent-setting-theme-luminance>
            -->
            <div id="header">${() => S.Locale.Frontend_FluentCore_SettingsDialog_Title()}</div>
            <div id="content">${repeat(model => model.settings, templateSettingRow)}</div>
            <div id="footer"><fluent-button id="settings-close-button" appearance="accent" @click=${model => model.hidden = true}>${() => S.Locale.Frontend_FluentCore_SettingsDialog_CloseButton_Label()}</fluent-button></div>
        </div>
    </fluent-dialog>
`;

@customElement({ name: 'fluent-settings-dialog', template, styles })
export class SettingsDialog extends FASTElement {

    @observable hidden = true;
    @observable settings = [...HakuNeko.SettingsManager.OpenScope()];
}