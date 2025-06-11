import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, ref, observable, when, repeat } from '@microsoft/fast-element';
import { type ISetting, Text, Secret, Numeric, Check, Choice, Directory } from '../../../engine/SettingsManager';
import type { InteractiveFileContentProvider } from '../../../engine/InteractiveFileContentProvider';
import { InteractiveFileContentProviderService } from '../services/InteractiveFileContentProviderService';
import { S, StateManagerService, type StateManager } from '../services/StateManagerService';
import type { FluentNumberField } from './FluentNumberField';
import type { Dialog } from '@fluentui/web-components';

import IconFolder from '@vscode/codicons/src/icons/folder-opened.svg?raw';

const styles: ElementStyles = css`

    #settings {
        display: grid;
        align-items: center;
        grid-template-columns: max-content max-content;
        gap: var(--spacingHorizontalS);
    }

    /*
    fluent-text-input {
        display: block;
        max-width: unset !important;
    }
    */

    /* #settings .input {
        display: contents;
    } */

    /* fluent-select::part(listbox) {
        max-height: 200px;
    } */
`;

const templateText: ViewTemplate<Text> = html`
    <fluent-text-input type="text" :value=${model => model.Value} @change=${(model, ctx) => model.Value = ctx.event.currentTarget['value']}></fluent-text-input>
`;

const templateSecret: ViewTemplate<Secret> = html`
    <fluent-text-input type="password" :value=${model => model.Value} @change=${(model, ctx) => model.Value = ctx.event.currentTarget['value']}></fluent-text-input>
`;

// TODO: Migrate to real fluent-number-field as soon as available
const templateNumeric: ViewTemplate<Numeric> = html`
    <fluent-number-field :min=${model => model.Min} :max=${model => model.Max} :valueAsNumber=${model => model.Value} @change=${(model, ctx) => model.Value = ctx.eventTarget<FluentNumberField>().valueAsNumber}></input>
`;

const templateCheck: ViewTemplate<Check> = html`
    <fluent-checkbox style="display: inline-block;" :checked=${model => model.Value} @change=${(model, ctx) => model.Value = ctx.event.currentTarget['checked']}></fluent-checkbox>
`;

const templateChoiceOption: ViewTemplate<{key: string, label: string}> = html`
    <fluent-option value="${model => model.key}">${model => S.Locale[model.label]()}</fluent-option>
`;

const templateChoice: ViewTemplate<Choice> = html`
    <fluent-dropdown type="dropdown" :value=${model => model.Value} @change=${(model, ctx) => model.Value = ctx.event.currentTarget['value']}>
        <fluent-listbox>
            ${repeat(model => model.Options, templateChoiceOption)}
        </fluent-listbox>
    </fluent-dropdown>
`;

const templateDirectory: ViewTemplate<Directory> = html`
    <fluent-text-input type="text" readonly id="${model => model.ID}" :value=${model => model.Value?.name}>
        <fluent-button slot="end" icon-only size="small" appearance="transparent" :innerHTML=${() => IconFolder} @click=${(model, ctx) => (ctx.parent as SettingsDialog).SelectDirectory(model)}></fluent-button>
    </fluent-text-input>
`;

const templateSettingRow: ViewTemplate<ISetting> = html`
    <div title=${model => S.Locale[model.Description]()}>${model => S.Locale[model.Label]()}</div>
    ${when(model => model instanceof Text, templateText)}
    ${when(model => model instanceof Secret, templateSecret)}
    ${when(model => model instanceof Numeric, templateNumeric)}
    ${when(model => model instanceof Check, templateCheck)}
    ${when(model => model instanceof Choice, html`<div>-</div>` /*templateChoice*/)}
    ${when(model => model instanceof Directory, templateDirectory)}
`;

const template: ViewTemplate<SettingsDialog> = html`
    <fluent-dialog type="modal" ${ref('dialog')}>
        <fluent-dialog-body>
            <div slot="title">${model => model.S.Locale.Frontend_FluentCore_SettingsDialog_Title()}</div>
            <div id="settings">
                ${repeat(model => model.settings, templateSettingRow)}
            </div>
            <fluent-button slot="action" appearance="accent" @click=${(model: SettingsDialog) => model.dialog.hide()}>
                ${ model => model.S.Locale.Frontend_FluentCore_SettingsDialog_CloseButton_Label() }
            </fluent-button>
        </fluent-dialog-body>
    </fluent-dialog>
<!--
    <fluent-dropdown type="dropdown">
        <fluent-listbox>
            <fluent-option value="1">1 - A</fluent-option>
            <fluent-option value="2">2 - B</fluent-option>
            <fluent-option value="3">3 - C</fluent-option>
        </fluent-listbox>
    </fluent-dropdown>
-->
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