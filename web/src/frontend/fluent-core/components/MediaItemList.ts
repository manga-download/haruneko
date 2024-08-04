import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable } from '@microsoft/fast-element';
import type { StoreableMediaContainer, MediaContainer, MediaItem } from '../../../engine/providers/MediaPlugin';
import S from '../services/StateService';

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
    'padding: calc(var(--design-unit) * 1px);',
    'border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);',
    'gap: calc(var(--design-unit) * 1px);',
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

const styles: ElementStyles = css`

    :host {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: min-content min-content minmax(0, 1fr);
    }

    #header {
        padding: calc(var(--base-height-multiplier) * 1px);
        background-color: var(--neutral-layer-2);
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
        color: var(--neutral-foreground-hint);
        margin-left: calc(var(--design-unit) * 1px);
        margin-right: calc(var(--design-unit) * 1px);
    }

    #searchcontrol {
        padding: calc(var(--base-height-multiplier) * 1px);
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        border-bottom: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        background-color: var(--neutral-layer-2);
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

    /*
    #entries .entry {
        padding: calc(var(--design-unit) * 1px);
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        gap: calc(var(--design-unit) * 1px);
        display: grid;
        align-items: center;
        grid-template-rows: min-content;
        grid-template-columns: min-content 1fr min-content;
    }

    #entries .entry > div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    #entries .entry .controls {
        visibility: hidden;
        display: flex;
    }

    #entries .entry:hover {
        background-color: var(--neutral-fill-hover);
    }

    #entries .entry:hover .controls {
        visibility: visible;
    }
    */
`;

const listitem: ViewTemplate<StoreableMediaContainer<MediaItem>> = html`
    <div class="entry" style="${styleEntry}" onmouseover="this.querySelector('div.controls').style.visibility = 'visible'" onmouseout="this.querySelector('div.controls').style.visibility = 'hidden'">
        <div style="${styleTrim}"><!-- <fluent-checkbox></fluent-checkbox> --></div>
        <div style="${styleTrim}">${model => model.Title}</div>
        <div class="controls" style="${styleControls}">
            <fluent-button
                appearance="stealth"
                title="${() => S.Locale.Frontend_FluentCore_MediaItemList_PreviewButton_Description()}"
                :innerHTML=${() => IconPreview}
                @click=${(model, ctx) => ctx.parent.parentNode.host.ShowPreview(model)}>
            </fluent-button>
            <fluent-button
                appearance="stealth"
                title="${() => S.Locale.Frontend_FluentCore_MediaItemList_DownloadButton_Description()}"
                :innerHTML=${() => IconDownload}
                @click=${(model, ctx) => ctx.parent.parentNode.host.Download(model)}>
            </fluent-button>
        </div>
    </div>
`;

const template: ViewTemplate<MediaItemList> = html`
    <div id="header">
        <div id="title">${() => S.Locale.Frontend_FluentCore_MediaItemList_Heading()}</div>
        <div id="controls">
            <div class="hint">${model => model.filtered?.length ?? '┄'}／${model => model.Entries?.length ?? '┄'}</div>
            <fluent-button
                id="button-update-entries"
                appearance="stealth"
                class="${model => model.updating.includes(model.Container?.Identifier) ? 'updating' : ''}"
                title="${() => S.Locale.Frontend_FluentCore_MediaTitleSelect_UpdateEntriesButton_Description()}"
                ?disabled=${model => !model.Container || model.updating.includes(model.Container?.Identifier)}
                :innerHTML=${() => IconSynchronize}
                @click=${(model, ctx) => model.UpdateEntries(ctx.event)}>
            </fluent-button>
        </div>
    </div>
    <div id="searchcontrol">
        <fluent-searchbox allowcase allowregex @predicate=${(model, ctx) => model.Match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
    </div>
    <fluent-lazy-scroll id="entries" :Items=${model => model.filtered} :template=${listitem}></fluent-lazy-scroll>
`;

@customElement({ name: 'fluent-media-item-list', template, styles })
export class MediaItemList extends FASTElement {

    @observable Container?: MediaContainer<StoreableMediaContainer<MediaItem>>;
    ContainerChanged() {
        this.Entries = this.Container?.Entries.Value ?? [];
    }

    @observable Entries: StoreableMediaContainer<MediaItem>[] = [];
    EntriesChanged() {
        this.FilterEntries();
    }
    @observable Match: (text: string) => boolean = () => true;
    MatchChanged() {
        this.FilterEntries();
    }
    @observable filtered: StoreableMediaContainer<MediaItem>[] = [];
    @observable updating: Array<string> = [];

    public async FilterEntries() {
        this.filtered = this.Entries?.filter(entry => this.Match(entry.Title)) ?? [];
    }

    public async UpdateEntries(event: Event): Promise<void> {
        event.stopPropagation();
        const container = this.Container;
        try {
            if(!this.updating.includes(container.Identifier)) {
                this.updating = [ ...this.updating, container.Identifier ];
                await container?.Update();
                this.ContainerChanged();
            }
        } catch(error) {
            console.warn(error);
        } finally {
            this.updating = this.updating.filter(id => id !== container.Identifier);
        }
    }

    public async ShowPreview(entry: StoreableMediaContainer<MediaItem>) {
        this.$emit('previewClicked', entry);
    }

    public async Download(entry: StoreableMediaContainer<MediaItem>) {
        HakuNeko.DownloadManager.Enqueue(entry);
    }
}