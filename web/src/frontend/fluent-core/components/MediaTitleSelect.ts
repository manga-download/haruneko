import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, Observable, ref } from '@microsoft/fast-element';
import type { MediaContainer, MediaChild } from '../../../engine/providers/MediaPlugin';
import type { BookmarkPlugin } from '../../../engine/providers/BookmarkPlugin';
import type { Bookmark } from '../../../engine/providers/Bookmark';
import type { SearchBox } from './SearchBox';
import S from '../services/StateService';
import { Exception } from '../../../engine/Error';
import { FrontendResourceKey as R } from '../../../i18n/ILocale';

import IconSynchronize from '@vscode/codicons/src/icons/refresh.svg?raw'; // sync.svg
import IconClipboard from '@fluentui/svg-icons/icons/clipboard_link_20_regular.svg?raw';
//import IconAnime from '@fluentui/svg-icons/icons/video_clip_20_regular.svg?raw';
//import IconManga from '@fluentui/svg-icons/icons/image_multiple_20_regular.svg?raw';
//import IconNovel from '@fluentui/svg-icons/icons/document_text_20_regular.svg?raw';
//import IconBookmark from '@fluentui/svg-icons/icons/bookmark_20_regular.svg?raw';
import IconAddBookmark from '@fluentui/svg-icons/icons/bookmark_off_20_regular.svg?raw';
import IconRemoveBookmark from '@fluentui/svg-icons/icons/bookmark_20_filled.svg?raw';

// #entries .entry
const styleEntries = [
    'height: 42px;',
    'padding: calc(var(--design-unit) * 1px);',
    'border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);',
    'gap: calc(var(--design-unit) * 1px);',
    'display: grid;',
    'grid-template-rows: min-content 1fr;',
    'grid-template-columns: min-content 1fr;',
    // HACK: => hovered cursor
    'cursor: pointer;',
].join(' ');

// #entries .entry:hover
// cursor: pointer;
// background-color: var(--neutral-fill-hover);

// #entries .entry > div
const styleTrim = [
    'overflow: hidden;',
    'white-space: nowrap;',
    'text-overflow: ellipsis;',
].join(' ');

// #entries .entry > .title
const styleTitle = styleTrim + ' font-weight: bold;';

// .hint
const styleHint = styleTrim + ' color: var(--neutral-foreground-hint);';

// .icon
const styleIcon = [
    'margin-right: calc(var(--design-unit) * 1px);',
    'height: inherit;',
    'grid-row: 1 / -1;',
].join(' ');

const styles: ElementStyles = css`

    :host {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: min-content minmax(0, 1fr);
    }

    #heading {
        background-color: var(--neutral-layer-2);
        padding: calc(var(--design-unit) * 1px);
        gap: calc(var(--base-height-multiplier) * 1px);
        display: grid;
        align-items: center;
        grid-template-columns: max-content 1fr max-content;
    }

    #heading:hover {
        cursor: pointer;
        background-color: var(--neutral-fill-hover);
    }

    #heading #logo {
        height: calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px);
    }

    #heading #title {
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
        height: 320px;
        padding: 0;
        margin: 0;
    }

    /*
    #entries .entry {
        height: 42px;
        padding: calc(var(--design-unit) * 1px);
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        gap: calc(var(--design-unit) * 1px);
        display: grid;
        grid-template-rows: min-content 1fr;
        grid-template-columns: min-content 1fr;
    }

    #entries .entry > div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    #entries .entry:hover {
        cursor: pointer;
        background-color: var(--neutral-fill-hover);
    }

    .icon {
        margin-right: calc(var(--design-unit) * 1px);
        height: inherit;
        grid-row: 1 / -1;
    }
    */

    .hint {
        color: var(--neutral-foreground-hint);
    }
`;

const unstarred: ViewTemplate<MediaTitleSelect> = html`
    <fluent-button id="add-favorite-button" appearance="stealth" ?disabled=${model => !model.Selected} title="${() => S.Locale.Frontend_FluentCore_MediaTitleSelect_AddBookmarkButton_Description()}" :innerHTML=${() => IconAddBookmark} @click=${(model, ctx) => model.AddBookmark(ctx.event)}></fluent-button>
`;

const starred: ViewTemplate<MediaTitleSelect> = html`
    <fluent-button id="remove-favorite-button" appearance="stealth" ?disabled=${model => !model.Selected} title="${() => S.Locale.Frontend_FluentCore_MediaTitleSelect_RemoveBookmarkButton_Description()}" :innerHTML=${() => IconRemoveBookmark} @click=${(model, ctx) => model.RemoveBookmark(ctx.event)}></fluent-button>
`;

// HACK: LazyScroll is a quick and dirty implementation, so the provided `ctx` is not correctly passed through
//       => classes are not working, apply inline styles
//       => manually query correct host and provide callback function
const listitem: ViewTemplate<MediaContainer<MediaChild>> = html`
    <div class="entry" style="${styleEntries}" onmouseover="this.style.backgroundColor = getComputedStyle(this).getPropertyValue('--neutral-fill-hover')" onmouseout="this.style.backgroundColor = ''" @click=${(model, ctx) => ctx.parent.parentNode.parentNode.host.SelectEntry(model) }>
        <img class="icon" style="${styleIcon}" src="${model => model.Icon}"></img>
        <div class="title" style="${styleTitle}">${model => model.Title}</div>
        <div class="hint" style="${styleHint}">${model => model.Identifier}</div>
    </div>
`;

const template: ViewTemplate<MediaTitleSelect> = html`
    <div id="heading" title="${() => S.Locale.Frontend_FluentCore_MediaTitleSelect_Description()}" @click=${model => model.Expanded = !model.Expanded}>
        <img id="logo" src="${model => model.Selected?.Icon}"></img>
        <div id="title">${model => model.Selected?.Title ?? '…'}</div>
        <div id="controls">
            <div class="hint">${model => model.updating.includes(model.Container?.Identifier) || model.pasting ? '┄' : (model.filtered?.length ?? '') + '／' + (model.Container?.Entries.Value.length ?? '')}</div>
            <fluent-button
                id="button-update-entries"
                appearance="stealth"
                class="${model => model.updating.includes(model.Container?.Identifier) || model.pasting ? 'updating' : ''}"
                title="${() => S.Locale.Frontend_FluentCore_WebsiteSelect_UpdateEntriesButton_Description()}"
                ?disabled=${model => !model.Container || model.updating.includes(model.Container?.Identifier) || model.pasting}
                :innerHTML=${() => IconSynchronize}
                @click=${(model, ctx) => model.UpdateEntries(ctx.event)}>
            </fluent-button>
            ${model => model.bookmark ? starred : unstarred}
            <fluent-button
                id="paste-clipboard-button"
                appearance="stealth"
                title="${() => S.Locale.Frontend_FluentCore_MediaTitleSelect_PasteClipboardButton_Description()}"
                ?disabled=${model => model.updating.includes(model.Container?.Identifier) || model.pasting}
                :innerHTML=${() => IconClipboard}
                @click="${(model, ctx) => model.PasteClipboard(ctx.event)}">
            </fluent-button>
        </div>
    </div>
    <div id="dropdown" ${ref('dropdown')}>
        <div id="searchcontrol">
            <fluent-searchbox id="searchbox" ${ref('searchbox')} placeholder="${() => S.Locale.Frontend_FluentCore_MediaTitleSelect_SearchBox_Placeholder()}" allowcase allowregex @predicate=${(model, ctx) => model.Match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
        </div>
        <fluent-lazy-scroll id="entries" :Items=${model => model.filtered} :template=${listitem}></fluent-lazy-scroll>
    </div>
`;

@customElement({ name: 'fluent-media-title-select', template, styles })
export class MediaTitleSelect extends FASTElement {

    override connectedCallback(): void {
        super.connectedCallback();
        HakuNeko.BookmarkPlugin.Entries.Subscribe(this.BookmarksChanged);
        HakuNeko.PastedClipboardURL.Subscribe(this.PastedClipboardUrlChanged);
        this.FilterEntries();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        HakuNeko.BookmarkPlugin.Entries.Unsubscribe(this.BookmarksChanged);
        HakuNeko.PastedClipboardURL.Unsubscribe(this.PastedClipboardUrlChanged);
    }

    readonly dropdown: HTMLDivElement;
    readonly searchbox: SearchBox;

    @observable Container: MediaContainer<MediaContainer<MediaChild>>;
    ContainerChanged() {
        const entry = this.Container?.Entries.Value.find(entry => entry.Identifier === this.Selected?.Identifier);
        this.Selected = entry ?? this.Selected;
        this.FilterEntries();
    }
    @observable Match: (text: string) => boolean = () => true;
    MatchChanged() {
        this.FilterEntries();
    }
    @observable filtered: MediaContainer<MediaChild>[] = [];
    @observable Selected: MediaContainer<MediaChild>;
    SelectedChanged(previous: MediaContainer<MediaChild>, current: MediaContainer<MediaChild>) {
        if(current !== previous) {
            this.BookmarksChanged(HakuNeko.BookmarkPlugin.Entries.Value, HakuNeko.BookmarkPlugin);
            this.$emit('selectedChanged', this.Selected);
        }
    }
    @observable Expanded = false;
    ExpandedChanged() {
        if(this.dropdown) {
            this.dropdown.style.display = this.Expanded ? 'block' : 'none';
            this.searchbox.control.control.focus();
            //this.searchbox.control.select();
        }
    }

    @observable updating: Array<string> = [];
    @observable bookmark = false;
    @observable scanning = false;
    @observable pasting = false;

    public async FilterEntries() {
        this.filtered = this.Container?.Entries?.Value.filter(entry => this.Match(entry.Title)) ?? [];
    }

    public SelectEntry(entry: MediaContainer<MediaChild>) {
        this.Selected = entry;
        this.Expanded = false;
        Observable.notify(this, 'expanded'); // force update of UI even when property not changed
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

    public async AddBookmark(event: Event) {
        event.stopPropagation();
        if(this.Selected) {
            await HakuNeko.BookmarkPlugin.Add(this.Selected as MediaContainer<MediaContainer<MediaChild>>);
        }
    }

    public async RemoveBookmark(event: Event) {
        event.stopPropagation();
        if(this.Selected && HakuNeko.BookmarkPlugin.IsBookmarked(this.Selected)) {
            const bookmark = HakuNeko.BookmarkPlugin.Find(this.Selected);
            await HakuNeko.BookmarkPlugin.Remove(bookmark);
        }
    }

    private BookmarksChanged = function(this: MediaTitleSelect, _: Bookmark[], sender: BookmarkPlugin) {
        this.bookmark = this.Selected && sender.IsBookmarked(this.Selected);
    }.bind(this);

    private PastedClipboardUrlChanged = async function(this: MediaTitleSelect, uri: URL) {
        try {
            this.pasting = true;
            for(const website of HakuNeko.PluginController.WebsitePlugins) {
                let media = await website.TryGetEntry(uri.href);
                if(media) {
                    media = HakuNeko.BookmarkPlugin.Entries.Value.find(entry => entry.IsSameAs(media)) ?? media;
                    await media.Update();
                    if(!this.Selected || !this.Selected.IsSameAs(media)) {
                        this.Selected = media;
                    }
                    return;
                }
            }
            throw new Exception(R.Frontend_Media_PasteLink_NotFoundError, uri.href);
        } catch(error) {
            console.warn(error);
        }
        finally {
            this.pasting = false;
        }
    }.bind(this);

    public async PasteClipboard(event: Event) {
        event.stopPropagation();
        const content = await navigator.clipboard.readText();
        try {
            HakuNeko.PastedClipboardURL.Value = new URL(content);
        } catch(error) {
            console.warn(error);
        }
    }
}