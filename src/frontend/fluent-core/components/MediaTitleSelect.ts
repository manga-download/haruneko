import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat, Observable } from '@microsoft/fast-element';
import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';
import type { BookmarkPlugin } from '../../../engine/providers/BookmarkPlugin';
import S from '../services/StateService';

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
    }

    #heading {
        padding: calc(var(--design-unit) * 1px);
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

    #button-update-entries.updating svg {
        animation: spinning 1.5s linear infinite;
    }

    @keyframes spinning {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    ul#entries {
        list-style-type: none;
        max-height: 320px;
        overflow-y: scroll;
        overflow-x: hidden;
        padding: 0;
        margin: 0;
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
    <fluent-button id="add-favorite-button" appearance="stealth" ?disabled=${model => !model.selected} title="${() => S.Locale.Frontend_FluentCore_MediaTitleSelect_AddBookmarkButton_Description()}" @click=${model => model.AddBookmark()}>${IconAddBookmark}</fluent-button>
`;

const starred: ViewTemplate<MediaTitleSelect> = html`
    <fluent-button id="remove-favorite-button" appearance="stealth" ?disabled=${model => !model.selected} title="${() => S.Locale.Frontend_FluentCore_MediaTitleSelect_RemoveBookmarkButton_Description()}" @click=${model => model.RemoveBookmark()}>${IconRemoveBookmark}</fluent-button>
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
                <fluent-button id="button-update-entries" appearance="stealth" class="${model => model.updating || model.pasting ? 'updating' : ''}" title="${() => S.Locale.Frontend_FluentCore_MediaTitleSelect_UpdateEntriesButton_Description()}" ?disabled=${model => !model.selected || model.updating || model.pasting} @click=${model => model.UpdateEntries()}>${IconSynchronize}</fluent-button>
                ${model => model.bookmark ? starred : unstarred}
                <fluent-button id="paste-clipboard-button" appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_MediaTitleSelect_PasteClipboardButton_Description()}" ?disabled=${model => model.updating || model.pasting} @click="${model => model.PasteClipboard()}">${IconClipboard}</fluent-button>
            </div>
        </div>
        <div id="dropdown">
            <div id="searchcontrol">
                <fluent-searchbox placeholder="${() => S.Locale.Frontend_FluentCore_MediaTitleSelect_SearchBox_Placeholder()}" allowcase allowregex @predicate=${(model, ctx) => model.match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
            </div>
            <ul id="entries">
                ${repeat(model => model.filtered, listitem)}
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
    entriesChanged() {
        this.FilterEntries();
    }
    @observable match: (text: string) => boolean = () => true;
    matchChanged() {
        this.FilterEntries();
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
    expandedChanged() {
        if(this.dropdown) {
            this.dropdown.style.display = this.expanded ? 'block' : 'none';
        }
    }
    @observable bookmark = false;
    @observable updating = false;
    @observable scanning = false;
    @observable pasting = false;

    private get dropdown(): HTMLElement {
        return this.shadowRoot.querySelector('#dropdown') as HTMLElement;
    }

    public async FilterEntries() {
        this.filtered = this.entries ? this.entries?.filter(entry => this.match(entry.Title)).slice(0, 250) /* TODO: virtual scrolling */ : [];
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