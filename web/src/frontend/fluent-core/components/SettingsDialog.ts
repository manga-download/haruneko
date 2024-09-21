import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, when, repeat } from '@microsoft/fast-element';
import { type ISetting, Text, Secret, Numeric, Check, Choice, Directory } from '../../../engine/SettingsManager';
import type { InteractiveFileContentProvider } from '../../../engine/InteractiveFileContentProvider';
import { InteractiveFileContentProviderService } from '../services/InteractiveFileContentProviderService';
import S from '../services/StateService';

import IconFolder from '@vscode/codicons/src/icons/folder-opened.svg?raw';

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
        align-items: center;
        grid-template-columns: auto;
        grid-template-rows: max-content minmax(0, 1fr) max-content;
    }

    #header {
        text-align: center;
        font-weight: bold;
        font-size: large;
    }

    #content {
        align-self: stretch;
        overflow-x: hidden;
        overlow-y: auto;
    }

    #settings {
        gap: calc(var(--base-height-multiplier) * 1px);
        padding-top: calc(var(--base-height-multiplier) * 1px);
        padding-bottom: calc(var(--base-height-multiplier) * 1px);
        display: grid;
        align-items: center;
        grid-template-columns: max-content max-content;
        align-items: center;
        align-content: center;
        justify-content: space-evenly;
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        border-bottom: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
    }

    #content .input > * {
        display: block;
    }

    #footer {
        text-align: center;
    }

    fluent-select::part(listbox) {
        max-height: 200px;
    }
`;

const templateText: ViewTemplate<Text> = html`
    <fluent-text-field :value=${model => model.Value} @change=${(model, ctx) => model.Value = ctx.event.currentTarget['value']}></fluent-text-field>
`;

const templateSecret: ViewTemplate<Secret> = html`
    <fluent-text-field type="password" :value=${model => model.Value} @change=${(model, ctx) => model.Value = ctx.event.currentTarget['value']}></fluent-text-field>
`;

const templateNumeric: ViewTemplate<Numeric> = html`
    <fluent-number-field :min=${model => model.Min} :max=${model => model.Max} :valueAsNumber=${model => model.Value} @change=${(model, ctx) => model.Value = ctx.event.currentTarget['valueAsNumber']}></fluent-number-field>
`;

const templateCheck: ViewTemplate<Check> = html`
    <fluent-checkbox style="display: inline-block;" :checked=${model => model.Value} @change=${(model, ctx) => model.Value = ctx.event.currentTarget['checked']}></fluent-checkbox>
`;

const templateChoiceOption: ViewTemplate<{key: string, label: string}> = html`
    <fluent-option value="${model => model.key}">${model => S.Locale[model.label]()}</fluent-option>
`;

const templateChoice: ViewTemplate<Choice> = html`
    <fluent-select :value=${model => model.Value} @change=${(model, ctx) => model.Value = ctx.event.currentTarget['value']}>
        ${repeat(model => model.Options, templateChoiceOption)}
    </fluent-select>
`;

const templateDirectory: ViewTemplate<Directory> = html`
    <fluent-text-field readonly id="${model => model.ID}" :value=${model => model.Value?.name}>
    <div slot="end" style="display: flex; align-items: center;">
        <fluent-button appearance="stealth" style="height: fit-content;" :innerHTML=${() => IconFolder} @click=${(model, ctx) => (ctx.parent as SettingsDialog).SelectDirectory(model)}></fluent-button>
    </div>
    </fluent-text-field>
`;

const templateSettingRow: ViewTemplate<ISetting> = html`
    <div title="${model => S.Locale[model.Description]()}">
        ${model => S.Locale[model.Label]()}
    </div>
    <div class="input">
        ${when(model => model instanceof Text, templateText)}
        ${when(model => model instanceof Secret, templateSecret)}
        ${when(model => model instanceof Numeric, templateNumeric)}
        ${when(model => model instanceof Check, templateCheck)}
        ${when(model => model instanceof Choice, templateChoice)}
        ${when(model => model instanceof Directory, templateDirectory)}
    </div>
`;

const template: ViewTemplate<SettingsDialog> = html`
    <fluent-dialog trap-focus modal ?hidden=${model => model.hidden}>
        <div id="dialog">
            <div id="header">${() => S.Locale.Frontend_FluentCore_SettingsDialog_Title()}</div>
            <div id="content">
                <div id="settings">
                    ${repeat(model => model.settings, templateSettingRow)}
                </div>
            </div>
            <div id="footer">
                <fluent-button id="settings-close-button" appearance="accent" @click=${model => model.hidden = true}>${() => S.Locale.Frontend_FluentCore_SettingsDialog_CloseButton_Label()}</fluent-button>
            </div>
        </div>
    </fluent-dialog>
`;

@customElement({ name: 'fluent-settings-dialog', template, styles })
export class SettingsDialog extends FASTElement {

    constructor() {
        super();
        S.ShowSettingsDialog = (...settings: ISetting[]) => {
            this.settings = settings;
            this.hidden = false;
        };
    }

    @observable hidden = true;
    @observable settings: ISetting[] = [];
    @InteractiveFileContentProviderService fileIO: InteractiveFileContentProvider;

    public async SelectDirectory(directory: Directory): Promise<void> {
        try {
            const folder = await this.fileIO.PickDirectory(directory.Value ?? 'documents') ?? directory.Value;
            this.shadowRoot.querySelector<HTMLInputElement>('#' + directory.ID).value = folder.name;
            directory.Value = folder;
        } catch(error) {
            if(this.fileIO.IsAbortError(error)) {
                return;
            } else {
                throw error;
            }
        }
    }
}