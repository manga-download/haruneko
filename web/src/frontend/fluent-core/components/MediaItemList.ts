import { FASTElement, html, css, observable } from '@microsoft/fast-element';
import type { StoreableMediaContainer, MediaContainer, MediaItem } from '../../../engine/providers/MediaPlugin';
import { LocalizationProviderRegistration, type ILocalizationProvider } from '../services/LocalizationProvider';
import { SettingsManagerRegistration, type ISettingsManager } from '../services/SettingsManager';
import type { LazyScroll } from './LazyScroll';

//import IconSortNone from '@fluentui/svg-icons/icons/arrow_sort_20_regular.svg?raw';
//import IconSortAscending from '@fluentui/svg-icons/icons/text_sort_ascending_20_regular.svg?raw';
//import IconSortDescending from '@fluentui/svg-icons/icons/text_sort_descending_20_regular.svg?raw';
//import IconPreview from '@vscode/codicons/src/icons/preview.svg?raw'; // eye
//import IconDownload from '@vscode/codicons/src/icons/cloud-download.svg?raw';
import IconSynchronize from '@vscode/codicons/src/icons/refresh.svg?raw'; // sync.svg
import IconPreview from '@fluentui/svg-icons/icons/eye_20_regular.svg?raw'; // preview_link
import IconDownload from '@fluentui/svg-icons/icons/arrow_circle_down_20_regular.svg?raw';
//import IconCheckBoxChecked from '@fluentui/svg-icons/icons/checkbox_checked_20_regular.svg?raw';
//import IconCheckBoxUnchecked from '@fluentui/svg-icons/icons/checkbox_unchecked_20_regular.svg?raw';
//import IconCheckBoxIndeterminate from '@fluentui/svg-icons/icons/checkbox_indeterminate_20_regular.svg?raw';

// #entries .entry
const styleEntry = [
    'padding: var(--spacingHorizontalXS);',
    'border-top: var(--strokeWidthThin) solid var(--colorNeutralStrokeSubtle);',
    'gap: var(--spacingHorizontalXS);',
    'display: grid;',
    'align-items: center;',
    'grid-template-rows: min-content;',
    'grid-template-columns: min-content 1fr min-content;',
].join(' ');

// #entries .entry > div
const styleTrim = [
    'overflow: hidden;',
    'white-space: nowrap;',
    'text-overflow: ellipsis;',
].join(' ');

// #entries .entry .controls
const styleControls = [
    styleTrim,
    'display: flex;',
    // HACK: => hovered buttons
    'visibility: hidden;',
].join(' ');

const styles = css`

    :host {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: min-content min-content minmax(0, 1fr);
    }

    #header {
        padding: var(--spacingHorizontalS);
        background-color: var(--colorNeutralBackground4);
        display: grid;
        align-items: center;
        grid-template-rows: auto;
        grid-template-columns: minmax(0, 1fr) max-content;
    }

    #title {
        text-transform: uppercase;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    #controls {
        display: flex;
        align-items: center;
    }

    #controls .hint {
        color: var(--colorNeutralForeground4);
        margin-left: var(--spacingHorizontalXS);
        margin-right: var(--spacingHorizontalXS);
    }

    #searchcontrol {
        padding: var(--spacingHorizontalS);
        border-top: var(--strokeWidthThin) solid var(--colorNeutralStrokeSubtle);
        border-bottom: var(--strokeWidthThin) solid var(--colorNeutralStrokeSubtle);
        background-color: var(--colorNeutralBackground4);
    }

    #button-update-entries.updating svg {
        animation: spinning 1.5s linear infinite;
    }

    @keyframes spinning {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    #entries {
        padding: 0;
        margin: 0;
    }
`;

function CreateItemTemplate(container: MediaItemList) {
    return html<StoreableMediaContainer<MediaItem>, LazyScroll>`
        <div class="entry" style="${styleEntry}" onmouseover="this.querySelector('div.controls').style.visibility = 'visible'" onmouseout="this.querySelector('div.controls').style.visibility = 'hidden'">
            <div style="${styleTrim}"><!-- <fluent-checkbox></fluent-checkbox> --></div>
            <div style="${styleTrim}">${model => model.Title}</div>
            <div class="controls" style="${styleControls}">
                <fluent-button
                    icon-only
                    appearance="transparent"
                    title="${() => container.Localization.Locale.Frontend_FluentCore_MediaItemList_PreviewButton_Description()}"
                    :innerHTML=${() => IconPreview}
                    @click=${model => container.ShowPreview(model)}>
                </fluent-button>
                <fluent-button
                    icon-only
                    appearance="transparent"
                    title="${() => container.Localization.Locale.Frontend_FluentCore_MediaItemList_DownloadButton_Description()}"
                    :innerHTML=${() => IconDownload}
                    @click=${model => container.Download(model)}>
                </fluent-button>
            </div>
        </div>
    `;
}

const template = html<MediaItemList>`
    <div id="header">
        <div id="title">${model => model.Localization.Locale.Frontend_FluentCore_MediaItemList_Heading()}</div>
        <div id="controls">
            <div class="hint">${model => model.filtered?.length ?? '┄'}／${model => model.Entries?.length ?? '┄'}</div>
            <fluent-button
                icon-only
                id="button-update-entries"
                appearance="transparent"
                class="${model => model.updating.includes(model.Container?.Identifier) ? 'updating' : ''}"
                title="${model => model.Localization.Locale.Frontend_FluentCore_MediaTitleSelect_UpdateEntriesButton_Description()}"
                ?disabled=${model => !model.Container || model.updating.includes(model.Container?.Identifier)}
                :innerHTML=${() => IconSynchronize}
                @click=${(model, ctx) => model.UpdateEntries(ctx.event)}>
            </fluent-button>
        </div>
    </div>
    <div id="searchcontrol">
        <fluent-searchbox allowcase allowregex @predicate=${(model, ctx) => model.Match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
    </div>
    <fluent-lazy-scroll id="entries" :Items=${model => model.filtered} :Pagination=${250} :template=${model => CreateItemTemplate(model)}></fluent-lazy-scroll>
`;

export class MediaItemList extends FASTElement {

    @LocalizationProviderRegistration Localization: ILocalizationProvider;
    @SettingsManagerRegistration SettingsManager: ISettingsManager;

    @observable Container?: MediaContainer<StoreableMediaContainer<MediaItem>>;
    ContainerChanged() {
        this.Entries = this.Container?.Entries.Value ?? [];
    }

    @observable Entries: ReadonlyArray<StoreableMediaContainer<MediaItem>> = [];
    EntriesChanged() {
        this.FilterEntries();
    }
    @observable Match: (text: string) => boolean = () => true;
    MatchChanged() {
        this.FilterEntries();
    }
    @observable filtered: ReadonlyArray<StoreableMediaContainer<MediaItem>> = [];
    @observable updating: Array<string> = [];

    public async FilterEntries() {
        this.filtered = this.Entries?.filter(entry => this.Match(entry.Title)) ?? [];
    }

    public async UpdateEntries(event: Event): Promise<void> {
        event.stopPropagation();
        const container = this.Container;
        try {
            if (!this.updating.includes(container.Identifier)) {
                this.updating = [ ...this.updating, container.Identifier ];
                await container?.Update();
                this.ContainerChanged();
            }
        } catch (error) {
            console.warn(error);
        } finally {
            this.updating = this.updating.filter(id => id !== container.Identifier);
        }
    }

    public async ShowPreview(entry: StoreableMediaContainer<MediaItem>) {
        this.$emit('previewClicked', entry);
    }

    public async Download(entry: StoreableMediaContainer<MediaItem>) {
        try {
            await this.SettingsManager.SettingMediaDirectory.EnsureAccess();
        } catch (error) {
            // TODO: Introduce generic UI component to show errors
            return alert(error.message ?? error);
        }
        await HakuNeko.DownloadManager.Enqueue(entry);
    }
}

MediaItemList.define({ name: 'fluent-media-item-list', template, styles });