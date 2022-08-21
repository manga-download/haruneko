import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat } from '@microsoft/fast-element';
import type { IMediaContainer, IMediaItem } from '../../../engine/providers/MediaPlugin';
import S from '../services/StateService';

import IconSortNone from '@fluentui/svg-icons/icons/arrow_sort_20_regular.svg?raw';
import IconSortAscending from '@fluentui/svg-icons/icons/text_sort_ascending_20_regular.svg?raw';
import IconSortDescending from '@fluentui/svg-icons/icons/text_sort_descending_20_regular.svg?raw';
import IconSearch from '@vscode/codicons/src/icons/search.svg?raw';
import IconCase from '@vscode/codicons/src/icons/case-sensitive.svg?raw';
import IconClear from '@vscode/codicons/src/icons/trash.svg?raw';
import IconRegex from '@vscode/codicons/src/icons/regex.svg?raw';
//import IconPreview from '@vscode/codicons/src/icons/preview.svg?raw'; // eye
//import IconDownload from '@vscode/codicons/src/icons/cloud-download.svg?raw';
import IconPreview from '@fluentui/svg-icons/icons/eye_20_regular.svg?raw'; // preview_link
import IconDownload from '@fluentui/svg-icons/icons/arrow_circle_down_20_regular.svg?raw';
import IconCheckBoxChecked from '@fluentui/svg-icons/icons/checkbox_checked_20_regular.svg?raw';
import IconCheckBoxUnchecked from '@fluentui/svg-icons/icons/checkbox_unchecked_20_regular.svg?raw';
import IconCheckBoxIndeterminate from '@fluentui/svg-icons/icons/checkbox_indeterminate_20_regular.svg?raw';
import { Priority } from '../../../engine/taskpool/DeferredTask';

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

    #searchpattern {
        display: block;
    }

    #searchpattern svg {
        width: 100%;
        height: 100%;
    }

    #searchpattern [slot="end"] {
        display: flex;
    }

    #searchpattern [slot="end"] fluent-button {
        height: fit-content;
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
        display: flex;
    }

    ul#entries li:hover {
        background-color: var(--neutral-fill-hover);
    }
`;

const listitem: ViewTemplate<IMediaContainer> = html`
    <li>
        <div><!-- <fluent-checkbox></fluent-checkbox> --></div>
        <div>${model => model.Title}</div>
        <div class="controls">
            <fluent-button appearance="stealth" @click=${(model, ctx) => ctx.parent.ShowPreview(model)}>${IconPreview}</fluent-button>
            <fluent-button appearance="stealth" @click=${(model, ctx) => ctx.parent.Download(model)}>${IconDownload}</fluent-button>
        </div>
    </li>
`;

const template: ViewTemplate<MediaItemSelect> = html`
    <div id="searchcontrol">
        <fluent-text-field id="searchpattern" appearance="outline" placeholder="${() => S.Locale.Frontend_BarelyFluid_MediaContainer_SearchTextbox_Placeholder()}" :value=${model => model.filtertext} @input=${(model, ctx) => model.filtertext = ctx.event.currentTarget['value']}>
            <!-- ${() => S.Locale.Frontend_BarelyFluid_MediaContainer_SearchTextbox_Label()} -->
            <div slot="start">${IconSearch}</div>
            <div slot="end">
                <fluent-button appearance="stealth" @click=${model => model.filtertext = ''}>${IconClear}</fluent-button>
                <fluent-button appearance="${model => model.filtercase ? 'outline' : 'stealth'}" @click=${model => model.filtercase = !model.filtercase}>${IconCase}</fluent-button>
                <fluent-button appearance="${model => model.filterregex ? 'outline' : 'stealth'}" @click=${model => model.filterregex = !model.filterregex}>${IconRegex}</fluent-button>
            </div>
        </fluent-text-field>
    </div>
    <ul id="entries">
        ${repeat(model => model.filtered, listitem)}
    </ul>
`;

@customElement({ name: 'fluent-media-item-select', template, styles })
export class MediaItemSelect extends FASTElement {

    @observable entries: IMediaContainer[] = [];
    entriesChanged(previous: IMediaContainer[], current: IMediaContainer[]) {
        if(previous !== current) {
            this.FilterEntries();
        }
    }
    @observable filtered: IMediaContainer[] = [];
    @observable updating = false;
    @observable filtertext = '';
    filtertextChanged() {
        this.FilterEntries();
    }
    @observable filtercase = false;
    filtercaseChanged() {
        this.FilterEntries();
    }
    @observable filterregex = false;
    filterregexChanged() {
        this.FilterEntries();
    }

    public async FilterEntries() {
        let filtered = this.entries ?? [];
        try {
            if(this.filterregex) {
                const pattern = new RegExp(this.filtertext, this.filtercase ? undefined : 'i');
                filtered = !this.filtertext ? filtered : this.entries?.filter(entry => pattern.test(entry.Title));
            }
            else {
                const pattern = this.filtertext?.toLowerCase();
                filtered = !this.filtertext ? filtered : this.entries?.filter(entry => this.filtercase ? entry.Title.includes(this.filtertext) : entry.Title.toLowerCase().includes(pattern));
            }
        } catch { /* ignore errors */ }
        this.filtered = filtered.slice(0, 250); // TODO: virtual scrolling
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

    /*
    public async UpdateEntries(): Promise<void> {
        try {
            this.updating = true;
            await this.selected?.Update();
        } catch(error) {
            console.warn(error);
        } finally {
            this.updating = false;
            this.$emit('entriesUpdated');
        }
    }
    */
}