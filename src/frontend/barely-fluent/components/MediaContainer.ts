import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, when, repeat, Observable } from '@microsoft/fast-element';
import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';
import S from '../services/StateService';

import IconSearch from '@vscode/codicons/src/icons/search.svg?raw';
import IconCase from '@vscode/codicons/src/icons/case-sensitive.svg?raw';
import IconRegex from '@vscode/codicons/src/icons/regex.svg?raw';
import IconSynchronize from '@vscode/codicons/src/icons/sync.svg?raw';
import IconClipboard from '@fluentui/svg-icons/icons/clipboard_link_20_regular.svg?raw';
//import IconAnime from '@fluentui/svg-icons/icons/video_clip_20_regular.svg?raw';
//import IconManga from '@fluentui/svg-icons/icons/image_multiple_20_regular.svg?raw';
//import IconNovel from '@fluentui/svg-icons/icons/document_text_20_regular.svg?raw';
//import IconBookmark from '@fluentui/svg-icons/icons/bookmark_20_regular.svg?raw';
import IconAddBookmark from '@fluentui/svg-icons/icons/bookmark_off_20_regular.svg?raw';
import IconRemoveBookmark from '@fluentui/svg-icons/icons/bookmark_20_filled.svg?raw';

const styles: ElementStyles = css`
    :host {
        /*border: 2px dotted grey;*/
    }
    #logo {
        height: calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px);
    }
    #title {
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis; 
    }
    .controls {
        display: flex;
        align-items: center;
    }
    #busy-status {
        margin: calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 0.25 * 1px);
        width: calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 0.75 * 1px);
        height: calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 0.75 * 1px);
    }
    #panel {
    }
    #searchbox {
        width: 100%;
    }
    #searchbox svg {
        width: 100%;
        height: 100%;
    }
    #searchbox .controls fluent-button {
        height: fit-content;
    }
    #entries {
        max-height: 240px;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    #entries ul {
        list-style-type: none;
        padding: 0;
    }
    #entries ul li:hover {
        cursor: pointer;
        background-color: var(--neutral-fill-hover);
    }
    .hint {
        padding: calc(var(--design-unit) * 1px);
        color: var(--neutral-foreground-hint);
    }
`;

const selected: ViewTemplate<MediaContainer> = html`
    <img id="logo" slot="start" src="${model => model.selected.Icon}"></img>
    <div id="title" slot="heading">${model => model.selected.Title}</div>
`;

const busy: ViewTemplate<MediaContainer> = html`
    <fluent-progress-ring id="busy-status"></fluent-progress-ring>
    <fluent-tooltip anchor="busy-status">${() => S.Locale.Frontend_BarelyFluid_MediaContainer_BusyStatus_Description()}</fluent-tooltip>
`;

const unstarred: ViewTemplate<MediaContainer> = html`
    <fluent-button id="add-favorite-button" appearance="stealth" ?disabled=${model => !model.selected} @click=${model => model.AddFavorite()}>${IconAddBookmark}</fluent-button>
    <fluent-tooltip anchor="add-favorite-button">${() => S.Locale.Frontend_BarelyFluid_MediaContainer_AddBookmarkButton_Description()}</fluent-tooltip>
`;

const starred: ViewTemplate<MediaContainer> = html`
    <fluent-button id="remove-favorite-button" appearance="stealth" ?disabled=${model => !model.selected} @click=${model => model.RemoveFavorite()}>${IconRemoveBookmark}</fluent-button>
    <fluent-tooltip anchor="remove-favorite-button">${() => S.Locale.Frontend_BarelyFluid_MediaContainer_RemoveBookmarkButton_Description()}</fluent-tooltip>
`;

const listitem: ViewTemplate<IMediaContainer> = html`
    <li @click=${(model, ctx) => ctx.parent.SelectEntry(model)}>
        <div>${model => model.Title}</div>
        <div class="hint">${model => model.Identifier}</div>
    </li>
`;

const template: ViewTemplate<MediaContainer> = html`
    <fluent-accordion-item ?expanded=${model => model.expanded}>
        ${when(model => model.selected, selected)}
        <div class="controls" slot="end">
            ${when(model => model.updating || model.pasting, busy)}
            <div class="hint">${model => !model.selected || model.updating || model.pasting ? '' : model.selected.Entries.length}</div>
            <fluent-button id="update-entries-button" appearance="stealth" ?disabled=${model => !model.selected || model.updating || model.pasting} @click=${model => model.UpdateEntries()}>${IconSynchronize}</fluent-button>
            <fluent-tooltip anchor="update-entries-button">${() => S.Locale.Frontend_BarelyFluid_MediaContainer_UpdateEntriesButton_Description()}</fluent-tooltip>
            ${model => model.bookmark ? starred : unstarred}
            <fluent-button id="paste-clipboard-button" appearance="stealth" ?disabled=${model => model.updating || model.pasting} @click="${model => model.PasteClipboard()}">${IconClipboard}</fluent-button>
            <fluent-tooltip anchor="paste-clipboard-button">${() => S.Locale.Frontend_BarelyFluid_MediaContainer_PasteClipboardButton_Description()}</fluent-tooltip>
        </div>
        <div id="panel">
            <div id="filters">
                <fluent-text-field id="searchbox" appearance="outline" placeholder="${() => S.Locale.Frontend_BarelyFluid_MediaContainer_SearchTextbox_Placeholder()}" @input=${(model, ctx) => model.filtertext = ctx.event.currentTarget['value']}>
                    <!-- ${() => S.Locale.Frontend_BarelyFluid_MediaContainer_SearchTextbox_Label()} -->
                    <div slot="start">${IconSearch}</div>
                    <div class="controls" slot="end">
                        <fluent-button appearance="${model => model.filtercase ? 'accent' : 'stealth'}" @click=${model => model.filtercase = !model.filtercase}>${IconCase}</fluent-button>
                        <fluent-button appearance="${model => model.filterregex ? 'accent' : 'stealth'}" @click=${model => model.filterregex = !model.filterregex}>${IconRegex}</fluent-button>
                    </div>
                </fluent-text-field>
            </div>
            <fluent-divider></fluent-divider>
            <div id="entries">
                <ul>
                    ${repeat(model => model.entries, listitem)}
                </ul>
            </div>
        </div>
    </fluent-accordion-item>
`;

@customElement({ name: 'fluent-accordion-mediacontainer', template, styles })
export class MediaContainer extends FASTElement {

    @observable expanded = false;
    @observable parent: IMediaContainer = HakuNeko.PluginController.WebsitePlugins[4];
    parentChanged(previous: IMediaContainer, current: IMediaContainer) {
        if(!previous || !previous.IsSameAs(current)) {
            this.entries = (current?.Entries ?? []).slice(0, 250) as IMediaContainer[]; // TODO: virtual scrolling
            this.selected = this.entries.find(entry => entry.IsSameAs(this.selected));
        }
    }
    @observable entries: IMediaContainer[] = [];
    @observable selected: IMediaContainer;
    selectedChanged(previous: IMediaContainer, current: IMediaContainer) {
        if(!previous || !previous.IsSameAs(current)) {
            this.$emit('changed');
        }
    }
    @observable bookmark = false;
    @observable updating = false;
    @observable scanning = false;
    @observable pasting = false;
    @observable filtertext = '';
    filtertextChanged(previous: typeof this.filtertext, current: typeof this.filtertext) {
        if(previous !== current) {
            this.FilterEntries();
        }
    }
    @observable filtercase = false;
    @observable filterregex = false;

    public async FilterEntries() {
        const pattern = new RegExp(this.filtertext, 'i');
        this.entries = (this.parent.Entries as IMediaContainer[]).filter(entry => {
            // TODO: consider tags ...
            return pattern.test(entry.Title);
        }).slice(0, 250); // TODO: virtual scrolling
    }

    public SelectEntry(entry: IMediaContainer) {
        this.selected = entry;
        this.expanded = false;
        Observable.notify(this, 'expanded'); // force update of UI even when property not changed
    }

    public async UpdateEntries(): Promise<void> {
        try {
            this.updating = true;
            await this.selected?.Update();
        } catch(error) {
            console.warn(error);
        } finally {
            this.updating = false;
        }
    }

    public AddFavorite() {
        this.bookmark = true;
        console.log('Added Bookmark', this.selected?.Identifier);
    }

    public RemoveFavorite() {
        this.bookmark = false;
        console.log('Removed Bookmark', this.selected?.Identifier);
    }

    public async PasteClipboard() {
        try {
            this.pasting = true;
            const link = new URL(await navigator.clipboard.readText()).href;
            for(const website of HakuNeko.PluginController.WebsitePlugins) {
                const media = await website.TryGetEntry(link) as IMediaContainer;
                if(media) {
                    this.parent = media.Parent;
                    if(!this.selected || !this.selected.IsSameAs(media)) {
                        this.selected = media;
                    }
                    return;
                }
            }
            throw new Error(`No matching website found for '${link}'`);
        } catch(error) {
            console.warn(error);
        }
        finally {
            this.pasting = false;
        }
    }
}