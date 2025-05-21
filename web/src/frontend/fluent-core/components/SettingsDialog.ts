import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, ref, observable, when, repeat } from '@microsoft/fast-element';
import { type ISetting, Text, Secret, Numeric, Check, Choice, Directory } from '../../../engine/SettingsManager';
import type { InteractiveFileContentProvider } from '../../../engine/InteractiveFileContentProvider';
import { InteractiveFileContentProviderService } from '../services/InteractiveFileContentProviderService';
import { S, StateManagerService, type StateManager } from '../services/StateManagerService';
import type { Dialog } from '@fluentui/web-components';

import IconFolder from '@vscode/codicons/src/icons/folder-opened.svg?raw';

const styles: ElementStyles = css`

/*
    :host {
        z-index: 2147483647;
    }

    #dialog {
        height: 100%;
        box-sizing: border-box;
        padding: var(--spacingHorizontalS);
        gap: var(--spacingHorizontalS);
        display: grid;
        align-items: center;
        grid-template-columns: auto;
        grid-template-rows: max-content minmax(0, 1fr) max-content;
    }

    #content {
        align-self: stretch;
        overflow-x: hidden;
        overlow-y: auto;
    }
*/
    #settings {
        display: grid;
        gap: var(--spacingHorizontalS);
        padding-top: var(--spacingHorizontalS);
        padding-bottom: var(--spacingHorizontalS);
        align-items: center;
        grid-template-columns: max-content max-content;
        align-items: center;
        align-content: center;
        justify-content: space-evenly;
        overflow-x: hidden;
    }

    #settings .input > * {
        display: block;
    }
/*
    fluent-select::part(listbox) {
        max-height: 200px;
    }
*/
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
        <fluent-button icon-only appearance="transparent" style="height: fit-content;" :innerHTML=${() => IconFolder} @click=${(model, ctx) => (ctx.parent as SettingsDialog).SelectDirectory(model)}></fluent-button>
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
    <fluent-dialog type="modal" ${ref('dialog')}>
        <fluent-dialog-body>
            <div slot="title">${model => model.S.Locale.Frontend_FluentCore_SettingsDialog_Title()}</div>
            <fluent-button slot="action" appearance="accent" @click=${(model: SettingsDialog) => model.dialog.hide()}>${model => model.S.Locale.Frontend_FluentCore_SettingsDialog_CloseButton_Label()}</fluent-button>
            <div id="settings">
                ${repeat(model => model.settings, templateSettingRow)}
            </div>
        </fluent-dialog-body>
    </fluent-dialog>
`;

@customElement({ name: 'fluent-settings-dialog', template, styles })
export class SettingsDialog extends FASTElement {

    readonly dialog: Dialog;
    @StateManagerService S: StateManager;
    @observable settings: ISetting[] = [];
    @InteractiveFileContentProviderService fileIO: InteractiveFileContentProvider;

    override connectedCallback(): void {
        super.connectedCallback();
        this.S.ShowSettingsDialog = (...settings: ISetting[]) => {
            this.settings = settings;
            this.dialog.show();
        };
    }

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