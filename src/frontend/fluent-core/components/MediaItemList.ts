import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat } from '@microsoft/fast-element';
import type { IMediaContainer, IMediaItem } from '../../../engine/providers/MediaPlugin';
import { Priority } from '../../../engine/taskpool/DeferredTask';
import S from '../services/StateService';

//import IconSortNone from '@fluentui/svg-icons/icons/arrow_sort_20_regular.svg?raw';
//import IconSortAscending from '@fluentui/svg-icons/icons/text_sort_ascending_20_regular.svg?raw';
//import IconSortDescending from '@fluentui/svg-icons/icons/text_sort_descending_20_regular.svg?raw';
//import IconPreview from '@vscode/codicons/src/icons/preview.svg?raw'; // eye
//import IconDownload from '@vscode/codicons/src/icons/cloud-download.svg?raw';
import IconPreview from '@fluentui/svg-icons/icons/eye_20_regular.svg?raw'; // preview_link
import IconDownload from '@fluentui/svg-icons/icons/arrow_circle_down_20_regular.svg?raw';
//import IconCheckBoxChecked from '@fluentui/svg-icons/icons/checkbox_checked_20_regular.svg?raw';
//import IconCheckBoxUnchecked from '@fluentui/svg-icons/icons/checkbox_unchecked_20_regular.svg?raw';
//import IconCheckBoxIndeterminate from '@fluentui/svg-icons/icons/checkbox_indeterminate_20_regular.svg?raw';

const styles: ElementStyles = css`
    :host {
        gap: calc(var(--design-unit) * 1px);
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: min-content minmax(0, 1fr);
    }

    #searchcontrol {
        padding: calc(var(--base-height-multiplier) * 1px);
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        border-bottom: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
    }

    #button-update-entries.updating svg {
        animation: spinning 1.5s linear infinite;
    }

    @keyframes spinning {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    ul#entries {
        list-style-type: none;
        overflow-y: scroll;
        overflow-x: hidden;
        padding: 0;
        margin: 0;
    }

    ul#entries li {
        padding: calc(var(--design-unit) * 1px);
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        gap: calc(var(--design-unit) * 1px);
        display: grid;
        align-items: center;
        grid-template-rows: min-content;
        grid-template-columns: min-content 1fr min-content;
    }

    ul#entries li > div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    ul#entries li .controls {
        visibility: hidden;
        display: flex;
    }

    ul#entries li:hover {
        background-color: var(--neutral-fill-hover);
    }

    ul#entries li:hover .controls {
        visibility: visible;
    }
`;

const listitem: ViewTemplate<IMediaContainer> = html`
    <li>
        <div><!-- <fluent-checkbox></fluent-checkbox> --></div>
        <div>${model => model.Title}</div>
        <div class="controls">
            <fluent-button appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_MediaItemList_PreviewButton_Description()}" @click=${(model, ctx) => ctx.parent.ShowPreview(model)}>${IconPreview}</fluent-button>
            <fluent-button appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_MediaItemList_DownloadButton_Description()}" @click=${(model, ctx) => ctx.parent.Download(model)}>${IconDownload}</fluent-button>
        </div>
    </li>
`;

const template: ViewTemplate<MediaItemList> = html`
    <div id="searchcontrol">
        <fluent-searchbox allowcase allowregex @predicate=${(model, ctx) => model.match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
    </div>
    <ul id="entries">
        ${repeat(model => model.filtered, listitem)}
    </ul>
`;

@customElement({ name: 'fluent-media-item-list', template, styles })
export class MediaItemList extends FASTElement {

    @observable entries: IMediaContainer[] = [];
    entriesChanged() {
        this.FilterEntries();
    }
    @observable match: (text: string) => boolean = () => true;
    matchChanged() {
        this.FilterEntries();
    }
    @observable filtered: IMediaContainer[] = [];
    @observable updating = false;

    public async FilterEntries() {
        this.filtered = this.entries ? this.entries?.filter(entry => this.match(entry.Title)).slice(0, 250) /* TODO: virtual scrolling */ : [];
    }

    public async ShowPreview(entry: IMediaContainer) {
        await entry.Update();
        console.log('PREVIEW:', entry.Entries);
        const first = await (entry.Entries[0] as IMediaItem)?.Fetch(Priority.High, undefined);
        console.log('PREVIEW [0]:', first?.type, first?.size);
    }

    public async Download(entry: IMediaContainer) {
        await entry.Update();
        console.log('DOWNLOAD:', entry.Entries);
        const first = await (entry.Entries[0] as IMediaItem)?.Fetch(Priority.Low, undefined);
        console.log('DOWNLOAD [0]:', first?.type, first?.size);
    }
}