import { FASTElement, type ExecutionContext, html, css, ref, observable, when, repeat } from '@microsoft/fast-element';
import type { TextInput, Checkbox, Dropdown, Dialog } from '@fluentui/web-components';
import type { FluentNumberField } from './FluentNumberField';
import { type ISetting, Text, Secret, Numeric, Check, Choice, Directory } from '../../../engine/SettingsManager';
import { InteractiveFileContentProviderRegistration, type IInteractiveFileContentProvider } from '../services/InteractiveFileContentProvider';
import { LocalizationProviderRegistration, type ILocalizationProvider } from '../services/LocalizationProvider';
import { SettingsManagerRegistration, type ISettingsManager } from '../services/SettingsManager';

import IconFolder from '@vscode/codicons/src/icons/folder-opened.svg?raw';

const styles = css`

    #settings {
        display: grid;
        align-items: center;
        grid-template-columns: max-content max-content;
        gap: var(--spacingHorizontalS);
    }
`;

const templateText = html<Text>`
    <fluent-text-input type="text" value=${model => model.Value} @change=${(model, ctx) => model.Value = ctx.eventTarget<TextInput>().value}></fluent-text-input>
`;

const templateSecret = html<Secret>`
    <fluent-text-input type="password" value=${model => model.Value} @change=${(model, ctx) => model.Value = ctx.eventTarget<TextInput>().value}></fluent-text-input>
`;

// TODO: Migrate to real fluent-number-field as soon as available
const templateNumeric = html<Numeric>`
    <fluent-number-field min=${model => model.Min} max=${model => model.Max} value=${model => model.Value} @change=${(model, ctx) => model.Value = ctx.eventTarget<FluentNumberField>().value}></input>
`;

const templateCheck = html<Check>`
    <fluent-checkbox style="display: inline-block;" :checked=${model => model.Value} @change=${(model, ctx) => model.Value = ctx.eventTarget<Checkbox>().checked}></fluent-checkbox>
`;

function CreateChoiceOptionTemplate(container: SettingsDialog, model: Choice) {
    return html<{ key: string, label: string; }>`
        <fluent-option value=${item => item.key} selected=${item => item.key === model.Value}>${item => container.Localization.Get(item.label)}</fluent-option>
    `;
}

function CreateChoiceTemplate(container: SettingsDialog/*, model: Choice*/) {
    return html<Choice>`
        <fluent-dropdown type="dropdown" id=${model => model.ID} @change=${(model, ctx) => model.Value = ctx.eventTarget<Dropdown>().value}>
            <fluent-listbox>
                ${repeat<Choice>(model => model.Options, model => CreateChoiceOptionTemplate(container, model))}
            </fluent-listbox>
        </fluent-dropdown>
    `;
}

const templateDirectory = html<Directory>`
    <fluent-text-input type="text" readonly id=${model => model.ID} value=${model => model.Value?.name}>
        <fluent-button slot="end" icon-only size="small" appearance="transparent" :innerHTML=${() => IconFolder} @click=${(model, ctx: ExecutionContext<SettingsDialog>) => ctx.parent.SelectDirectory(model)}></fluent-button>
    </fluent-text-input>
`;

function CreateSettingTemplate(container: SettingsDialog) {
    return html<ISetting>`
        <div title=${model => container.Localization.Locale[ model.Description ]()}>${model => container.Localization.Get(model.Label)}</div>
        ${when(model => model instanceof Text, templateText)}
        ${when(model => model instanceof Secret, templateSecret)}
        ${when(model => model instanceof Numeric, templateNumeric)}
        ${when(model => model instanceof Check, templateCheck)}
        ${when(model => model instanceof Choice, CreateChoiceTemplate(container))}
        ${when(model => model instanceof Directory, templateDirectory)}
    `;
}

const template = html<SettingsDialog>`
    <fluent-dialog type="modal" ${ref('dialog')}>
        <fluent-dialog-body>
            <div slot="title">${model => model.Localization.Locale.Frontend_FluentCore_SettingsDialog_Title()}</div>
            <div id="settings">
                ${repeat(model => model.Settings, CreateSettingTemplate)}
            </div>
            <fluent-button slot="action" appearance="accent" @click=${(model: SettingsDialog) => model.dialog.hide()}>
                ${model => model.Localization.Locale.Frontend_FluentCore_SettingsDialog_CloseButton_Label()}
            </fluent-button>
        </fluent-dialog-body>
    </fluent-dialog>
`;

export class SettingsDialog extends FASTElement {

    readonly dialog: Dialog;
    @InteractiveFileContentProviderRegistration InteractiveFileContentProvider: IInteractiveFileContentProvider;
    @LocalizationProviderRegistration Localization: ILocalizationProvider;
    @SettingsManagerRegistration SettingsManager: ISettingsManager;
    @observable Settings: ISetting[] = [];

    override connectedCallback(): void {
        super.connectedCallback();
        this.SettingsManager.ShowSettingsDialog = (...settings: ISetting[]) => {
            this.Settings = settings;
            this.dialog.show();
        };
    }

    public async SelectDirectory(directory: Directory): Promise<void> {
        try {
            const folder = await this.InteractiveFileContentProvider.PickDirectory(directory.Value ?? 'documents') ?? directory.Value;
            this.shadowRoot.querySelector<HTMLInputElement>('#' + directory.ID).value = folder.name;
            directory.Value = folder;
        } catch (error) {
            if (this.InteractiveFileContentProvider.IsAbortError(error)) {
                return;
            } else {
                throw error;
            }
        }
    }
}

SettingsDialog.define({ name: 'fluent-settings-dialog', template, styles });