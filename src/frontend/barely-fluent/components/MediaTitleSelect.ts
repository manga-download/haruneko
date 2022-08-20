import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat, Observable } from '@microsoft/fast-element';
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
import type { BookmarkPlugin } from '../../../engine/providers/BookmarkPlugin';

const styles: ElementStyles = css`
    :host {
        margin: calc(var(--base-height-multiplier) * 1px);
    }

    #heading {
        padding: calc(var(--base-height-multiplier) * 1px);
        gap: calc(var(--base-height-multiplier) * 1px);
        display: grid;
        align-items: center;
        grid-template-columns: max-content 1fr max-content;
    }

    #heading #logo {
        height: calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px);
    }

    #heading #title {
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
    }

    #controls {
        display: flex;
        align-items: center;
    }

    #controls .hint {
        margin-left: calc(var(--design-unit) * 1px);
        margin-right: calc(var(--design-unit) * 1px);
    }

    #dropdown {
        height: 100%;
        display: none;
    }

    #searchcontrol {
        padding: calc(var(--base-height-multiplier) * 1px);
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        border-bottom: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
    }

    #searchpattern {
        width: 50%;
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

    #entries {
        max-height: 320px;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    ul#entries {
        list-style-type: none;
        padding: 0;
    }

    ul#entries li {
        height: 42px; /* calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px); */
        padding: calc(var(--design-unit) * 1px);
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        gap: calc(var(--design-unit) * 1px);
        display: grid;
        grid-template-rows: min-content 1fr;
        grid-template-columns: min-content 1fr;
    }

    ul#entries li > div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    ul#entries li:hover {
        cursor: pointer;
        background-color: var(--neutral-fill-hover);
    }

    .icon {
        margin-right: calc(var(--design-unit) * 1px);
        height: inherit;
        grid-row: 1 / -1;
    }

    .hint {
        color: var(--neutral-foreground-hint);
    }
`;

const unstarred: ViewTemplate<MediaTitleSelect> = html`
    <fluent-button id="add-favorite-button" appearance="stealth" ?disabled=${model => !model.selected} @click=${model => model.AddBookmark()}>${IconAddBookmark}</fluent-button>
    <fluent-tooltip anchor="add-favorite-button">${() => S.Locale.Frontend_BarelyFluid_MediaContainer_AddBookmarkButton_Description()}</fluent-tooltip>
`;

const starred: ViewTemplate<MediaTitleSelect> = html`
    <fluent-button id="remove-favorite-button" appearance="stealth" ?disabled=${model => !model.selected} @click=${model => model.RemoveBookmark()}>${IconRemoveBookmark}</fluent-button>
    <fluent-tooltip anchor="remove-favorite-button">${() => S.Locale.Frontend_BarelyFluid_MediaContainer_RemoveBookmarkButton_Description()}</fluent-tooltip>
`;

const listitem: ViewTemplate<IMediaContainer> = html`
    <li @click=${(model, ctx) => ctx.parent.SelectEntry(model)}>
        <img class="icon" src="${model => model.Icon}"></img>
        <div style="font-weight: bold;">${model => model.Title}</div>
        <div class="hint">${model => model.Identifier}</div>
    </li>
`;

const template: ViewTemplate<MediaTitleSelect> = html`
    <fluent-card>
        <div id="heading">
            <img id="logo" src="${model => model.selected?.Icon}"></img>
            <div id="title" @click=${model => model.expanded = !model.expanded}>${model => model.selected?.Title ?? '…'}</div>
            <div id="controls">
                <div class="hint">${model => model.updating || model.pasting ? '┄' : model.selected?.Entries?.length ?? ''}</div>
                <fluent-button id="button-update-entries" appearance="stealth" class="${model => model.updating || model.pasting ? 'updating' : ''}" ?disabled=${model => !model.selected || model.updating || model.pasting} @click=${model => model.UpdateEntries()}>${IconSynchronize}</fluent-button>
                <fluent-tooltip anchor="button-update-entries">${() => S.Locale.Frontend_BarelyFluid_MediaContainer_UpdateEntriesButton_Description()}</fluent-tooltip>
                ${model => model.bookmark ? starred : unstarred}
                <fluent-button id="paste-clipboard-button" appearance="stealth" ?disabled=${model => model.updating || model.pasting} @click="${model => model.PasteClipboard()}">${IconClipboard}</fluent-button>
                <fluent-tooltip anchor="paste-clipboard-button">${() => S.Locale.Frontend_BarelyFluid_MediaContainer_PasteClipboardButton_Description()}</fluent-tooltip>
            </div>
        </div>
        <div id="dropdown">
            <div id="searchcontrol">
                <fluent-text-field id="searchpattern" appearance="outline" placeholder="${() => S.Locale.Frontend_BarelyFluid_MediaContainer_SearchTextbox_Placeholder()}" @input=${(model, ctx) => model.filtertext = ctx.event.currentTarget['value']}>
                    <!-- ${() => S.Locale.Frontend_BarelyFluid_MediaContainer_SearchTextbox_Label()} -->
                    <div slot="start">${IconSearch}</div>
                    <div slot="end">
                        <fluent-button appearance="${model => model.filtercase ? 'accent' : 'stealth'}" @click=${model => model.filtercase = !model.filtercase}>${IconCase}</fluent-button>
                        <fluent-button appearance="${model => model.filterregex ? 'accent' : 'stealth'}" @click=${model => model.filterregex = !model.filterregex}>${IconRegex}</fluent-button>
                    </div>
                </fluent-text-field>
            </div>
            <ul id="entries">
                ${repeat(model => model.entries, listitem)}
            </ul>
        </div>
    </fluent-card>
`;

@customElement({ name: 'fluent-media-title-select', template, styles })
export class MediaTitleSelect extends FASTElement {

    override connectedCallback(): void {
        super.connectedCallback();
        HakuNeko.BookmarkPlugin.EntriesUpdated.Subscribe(this.BookmarksChanged);
        this.FilterEntries();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        HakuNeko.BookmarkPlugin.EntriesUpdated.Unsubscribe(this.BookmarksChanged);
    }

    @observable entries: IMediaContainer[] = [];
    entriesChanged(previous: IMediaContainer[], current: IMediaContainer[]) {
        if(previous !== current) {
            this.FilterEntries();
        }
    }
    @observable filtered: IMediaContainer[] = [];
    @observable selected: IMediaContainer;
    selectedChanged(previous: IMediaContainer, current: IMediaContainer) {
        if(!previous || !previous.IsSameAs(current)) {
            this.BookmarksChanged(HakuNeko.BookmarkPlugin);
            this.$emit('selectedChanged');
        }
    }
    @observable expanded = false;
    expandedChanged(previous: boolean, current: boolean) {
        if(this.dropdown) {
            this.dropdown.style.display = current ? 'block' : 'none';
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

    private get dropdown(): HTMLElement {
        return this.shadowRoot.querySelector('#dropdown') as HTMLElement;
    }

    public async FilterEntries() {
        const pattern = new RegExp(this.filtertext, 'i');
        this.filtered = this.entries ? this.entries.filter(entry => {
            // TODO: consider tags ...
            return pattern.test(entry.Title);
        }).slice(0, 250) : []; // TODO: virtual scrolling
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
            this.$emit('entriesUpdated');
        }
    }

    public async AddBookmark() {
        if(this.selected) {
            await HakuNeko.BookmarkPlugin.Add(this.selected);
        }
    }

    public async RemoveBookmark() {
        if(this.selected && HakuNeko.BookmarkPlugin.isBookmarked(this.selected)) {
            const bookmark = HakuNeko.BookmarkPlugin.Find(this.selected);
            await HakuNeko.BookmarkPlugin.Remove(bookmark);
        }
    }

    private BookmarksChanged = function(sender: BookmarkPlugin) {
        this.bookmark = this.selected && sender.isBookmarked(this.selected);
    }.bind(this);

    public async PasteClipboard() {
        try {
            this.pasting = true;
            const link = new URL(await navigator.clipboard.readText()).href;
            for(const website of HakuNeko.PluginController.WebsitePlugins) {
                const media = await website.TryGetEntry(link) as IMediaContainer;
                if(media) {
                    if(!this.selected || !this.selected.IsSameAs(media)) {
                        this.selected = media;
                    }
                    return this.UpdateEntries();
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