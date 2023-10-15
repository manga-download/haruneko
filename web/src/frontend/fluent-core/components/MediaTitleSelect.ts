import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, Observable, ref } from '@microsoft/fast-element';
import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';
import type { BookmarkPlugin } from '../../../engine/providers/BookmarkPlugin';
import S from '../services/StateService';
import { Exception } from '../../../engine/Error';
import { VariantResourceKey as R } from '../../../i18n/ILocale';

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
    <fluent-button id="add-favorite-button" appearance="stealth" ?disabled=${model => !model.selected} title="${() => S.Locale.Frontend_FluentCore_MediaTitleSelect_AddBookmarkButton_Description()}" :innerHTML=${() => IconAddBookmark} @click=${(model, ctx) => model.AddBookmark(ctx.event)}></fluent-button>
`;

const starred: ViewTemplate<MediaTitleSelect> = html`
    <fluent-button id="remove-favorite-button" appearance="stealth" ?disabled=${model => !model.selected} title="${() => S.Locale.Frontend_FluentCore_MediaTitleSelect_RemoveBookmarkButton_Description()}" :innerHTML=${() => IconRemoveBookmark} @click=${(model, ctx) => model.RemoveBookmark(ctx.event)}></fluent-button>
`;

// HACK: LazyScroll is a quick and dirty implementation, so the provided `ctx` is not correctly passed through
//       => classes are not working, apply inline styles
//       => manually query correct host and provide callback function
const listitem: ViewTemplate<IMediaContainer> = html`
    <div class="entry" style="${styleEntries}" onmouseover="this.style.backgroundColor = getComputedStyle(this).getPropertyValue('--neutral-fill-hover')" onmouseout="this.style.backgroundColor = ''" @click=${(model, ctx) => ctx.parent.parentNode.parentNode.host.SelectEntry(model) }>
        <img class="icon" style="${styleIcon}" src="${model => model.Icon}"></img>
        <div class="title" style="${styleTitle}">${model => model.Title}</div>
        <div class="hint" style="${styleHint}">${model => model.Identifier}</div>
    </div>
`;

const template: ViewTemplate<MediaTitleSelect> = html`
    <div id="heading" title="${() => S.Locale.Frontend_FluentCore_MediaTitleSelect_Description()}" @click=${model => model.expanded = !model.expanded}>
        <img id="logo" src="${model => model.selected?.Icon}"></img>
        <div id="title">${model => model.selected?.Title ?? '…'}</div>
        <div id="controls">
            <div class="hint">${model => model.updating.includes(model.container?.Identifier) || model.pasting ? '┄' : (model.filtered?.length ?? '') + '／' + (model.container?.Entries.length ?? '')}</div>
            <fluent-button
                id="button-update-entries"
                appearance="stealth"
                class="${model => model.updating.includes(model.container?.Identifier) || model.pasting ? 'updating' : ''}"
                title="${() => S.Locale.Frontend_FluentCore_WebsiteSelect_UpdateEntriesButton_Description()}"
                ?disabled=${model => !model.container || model.updating.includes(model.container?.Identifier) || model.pasting}
                :innerHTML=${() => IconSynchronize}
                @click=${(model, ctx) => model.UpdateEntries(ctx.event)}>
            </fluent-button>
            ${model => model.bookmark ? starred : unstarred}
            <fluent-button
                id="paste-clipboard-button"
                appearance="stealth"
                title="${() => S.Locale.Frontend_FluentCore_MediaTitleSelect_PasteClipboardButton_Description()}"
                ?disabled=${model => model.updating.includes(model.container?.Identifier) || model.pasting}
                :innerHTML=${() => IconClipboard}
                @click="${(model, ctx) => model.PasteClipboard(ctx.event)}">
            </fluent-button>
        </div>
    </div>
    <div id="dropdown" ${ref('dropdown')}>
        <div id="searchcontrol">
            <fluent-searchbox placeholder="${() => S.Locale.Frontend_FluentCore_MediaTitleSelect_SearchBox_Placeholder()}" allowcase allowregex @predicate=${(model, ctx) => model.match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
        </div>
        <fluent-lazy-scroll id="entries" :items=${model => model.filtered} :template=${listitem}></fluent-lazy-scroll>
    </div>
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

    dropdown: HTMLDivElement;

    @observable container: IMediaContainer;
    containerChanged() {
        const entry = this.container?.Entries.find((entry: IMediaContainer) => entry.Identifier === this.selected?.Identifier) as IMediaContainer;
        this.selected = entry ?? this.selected;
        this.FilterEntries();
    }
    @observable match: (text: string) => boolean = () => true;
    matchChanged() {
        this.FilterEntries();
    }
    @observable filtered: IMediaContainer[] = [];
    @observable selected: IMediaContainer;
    selectedChanged(previous: IMediaContainer, current: IMediaContainer) {
        if(current !== previous) {
            this.BookmarksChanged(HakuNeko.BookmarkPlugin);
            this.$emit('selectedChanged', this.selected);
        }
    }
    @observable expanded = false;
    expandedChanged() {
        if(this.dropdown) {
            this.dropdown.style.display = this.expanded ? 'block' : 'none';
        }
    }

    @observable updating: Array<string> = [];
    @observable bookmark = false;
    @observable scanning = false;
    @observable pasting = false;

    public async FilterEntries() {
        this.filtered = this.container?.Entries?.filter((entry: IMediaContainer) => this.match(entry.Title)) as IMediaContainer[] ?? [];
    }

    public SelectEntry(entry: IMediaContainer) {
        this.selected = entry;
        this.expanded = false;
        Observable.notify(this, 'expanded'); // force update of UI even when property not changed
    }

    public async UpdateEntries(event: Event): Promise<void> {
        event.stopPropagation();
        const container = this.container;
        try {
            if(!this.updating.includes(container.Identifier)) {
                this.updating = [ ...this.updating, container.Identifier ];
                await container?.Update();
                this.containerChanged();
            }
        } catch(error) {
            console.warn(error);
        } finally {
            this.updating = this.updating.filter(id => id !== container.Identifier);
        }
    }

    public async AddBookmark(event: Event) {
        event.stopPropagation();
        if(this.selected) {
            await HakuNeko.BookmarkPlugin.Add(this.selected);
        }
    }

    public async RemoveBookmark(event: Event) {
        event.stopPropagation();
        if(this.selected && HakuNeko.BookmarkPlugin.isBookmarked(this.selected)) {
            const bookmark = HakuNeko.BookmarkPlugin.Find(this.selected);
            await HakuNeko.BookmarkPlugin.Remove(bookmark);
        }
    }

    private BookmarksChanged = function(sender: BookmarkPlugin) {
        this.bookmark = this.selected && sender.isBookmarked(this.selected);
    }.bind(this);

    public async PasteClipboard(event: Event) {
        event.stopPropagation();
        try {
            this.pasting = true;
            const link = new URL(await navigator.clipboard.readText()).href;
            for(const website of HakuNeko.PluginController.WebsitePlugins) {
                let media = await website.TryGetEntry(link) as IMediaContainer;
                if(media) {
                    media = HakuNeko.BookmarkPlugin.Entries.find(entry => entry.IsSameAs(media)) ?? media;
                    await media.Update();
                    if(!this.selected || !this.selected.IsSameAs(media)) {
                        this.selected = media;
                    }
                    return;
                }
            }
            throw new Exception(R.Frontend_Media_PasteLink_NotFoundError, link);
        } catch(error) {
            console.warn(error);
        }
        finally {
            this.pasting = false;
        }
    }
}