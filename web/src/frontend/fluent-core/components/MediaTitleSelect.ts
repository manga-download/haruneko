import { FASTElement, html, css, observable, Observable, ref } from '@microsoft/fast-element';
import type { MediaContainer, MediaChild } from '../../../engine/providers/MediaPlugin';
import type { BookmarkPlugin } from '../../../engine/providers/BookmarkPlugin';
import type { Bookmark } from '../../../engine/providers/Bookmark';
import { Exception } from '../../../engine/Error';
import { LocalizationProviderRegistration, type ILocalizationProvider } from '../services/LocalizationProvider';
import { FrontendResourceKey as R } from '../../../i18n/ILocale';
import type { SearchBox } from './SearchBox';

import IconSynchronize from '@vscode/codicons/src/icons/refresh.svg?raw'; // sync.svg
import IconClipboard from '@fluentui/svg-icons/icons/clipboard_link_20_regular.svg?raw';
//import IconAnime from '@fluentui/svg-icons/icons/video_clip_20_regular.svg?raw';
//import IconManga from '@fluentui/svg-icons/icons/image_multiple_20_regular.svg?raw';
//import IconNovel from '@fluentui/svg-icons/icons/document_text_20_regular.svg?raw';
//import IconBookmark from '@fluentui/svg-icons/icons/bookmark_20_regular.svg?raw';
import IconAddBookmark from '@fluentui/svg-icons/icons/bookmark_off_20_regular.svg?raw';
import IconRemoveBookmark from '@fluentui/svg-icons/icons/bookmark_20_filled.svg?raw';

const styles = css`

    :host {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: min-content minmax(0, 1fr);
    }

    #heading {
        background-color: var(--colorNeutralBackground4);
        padding: var(--spacingHorizontalXS);
        gap: var(--spacingHorizontalS);
        display: grid;
        align-items: center;
        grid-template-columns: max-content 1fr max-content;
    }

    #heading:hover {
        cursor: pointer;
        background-color: var(--colorNeutralBackground1Hover);
    }

    #heading #logo {
        height: var(--fontSizeBase600);
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
        margin-left: var(--spacingHorizontalXS);
        margin-right: var(--spacingHorizontalXS);
    }

    #dropdown {
        height: 100%;
        display: none;
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
        height: 320px;
        padding: 0;
        margin: 0;
    }

    .hint {
        color: var(--colorNeutralForeground4);
    }
`;

const unstarred = html<MediaTitleSelect>`
    <fluent-button icon-only id="add-favorite-button" appearance="transparent" ?disabled=${model => !model.Selected} title="${model => model.Localization.Locale.Frontend_FluentCore_MediaTitleSelect_AddBookmarkButton_Description()}" :innerHTML=${() => IconAddBookmark} @click=${(model, ctx) => model.AddBookmark(ctx.event)}></fluent-button>
`;

const starred = html<MediaTitleSelect>`
    <fluent-button icon-only id="remove-favorite-button" appearance="transparent" ?disabled=${model => !model.Selected} title="${model => model.Localization.Locale.Frontend_FluentCore_MediaTitleSelect_RemoveBookmarkButton_Description()}" :innerHTML=${() => IconRemoveBookmark} @click=${(model, ctx) => model.RemoveBookmark(ctx.event)}></fluent-button>
`;

// HACK: LazyScroll is a quick and dirty implementation, so the provided `ctx` is not correctly passed through
//       => CSS classes are not working, apply inline styles
//       => manually query correct host and provide callback function
function CreateItemTemplate<T extends MediaContainer<MediaChild>>(onSelectCallback: (entry: T) => void, canSelectCallback = (_entry: T) => true) {

    const styleEntry = [
        'height: 42px',
        'padding: var(--spacingHorizontalXS)',
        'border-top: var(--strokeWidthThin) solid var(--colorNeutralStrokeSubtle)',
        'gap: var(--spacingHorizontalXS)',
        'display: grid',
        'grid-template-rows: min-content 1fr',
        'grid-template-columns: min-content 1fr',
        // HACK: => hovered cursor
        'cursor: pointer',
    ].join(';');

    const styleEntryDisabled = [
        styleEntry,
        'opacity: 0.5',
    ].join(';');

    const styleEntryIcon = [
        'margin-right: var(--spacingHorizontalXS)',
        'height: inherit',
        'grid-row: 1 / -1',
    ].join(';');

    const styleTrim = [
        'overflow: hidden',
        'white-space: nowrap',
        'text-overflow: ellipsis',
    ].join(';');

    const styleEntryTitle = [
        styleTrim,
        'font-weight: bold',
    ].join(';');

    const styleEntryHint = [
        styleTrim,
        'color: var(--colorNeutralForeground4)',
    ].join(';');

    return html<T>`
        <div style="${model => canSelectCallback(model) ? styleEntry : styleEntryDisabled}" onmouseover="this.style.backgroundColor = getComputedStyle(this).getPropertyValue('--colorNeutralBackground1Hover')" onmouseout="this.style.backgroundColor = ''" @click=${model => onSelectCallback(model)}>
            <img style="${styleEntryIcon}" src="${model => model.Icon}"></img>
            <div style="${styleEntryTitle}">${model => model.Title}</div>
            <div style="${styleEntryHint}">${model => model.Identifier}</div>
        </div>
    `;
}

const template = html<MediaTitleSelect>`
    <div id="heading" title="${model => model.Localization.Locale.Frontend_FluentCore_MediaTitleSelect_Description()}" @click=${model => model.Expanded = !model.Expanded}>
        <img id="logo" src="${model => model.Selected?.Icon}"></img>
        <div id="title">${model => model.Selected?.Title ?? '…'}</div>
        <div id="controls">
            <div class="hint">${model => model.updating.includes(model.Container?.Identifier) || model.pasting ? '┄' : (model.filtered?.length ?? '') + '／' + (model.Container?.Entries.Value.length ?? '')}</div>
            <fluent-button
                icon-only
                id="button-update-entries"
                appearance="transparent"
                class="${model => model.updating.includes(model.Container?.Identifier) || model.pasting ? 'updating' : ''}"
                title="${model => model.Localization.Locale.Frontend_FluentCore_WebsiteSelect_UpdateEntriesButton_Description()}"
                ?disabled=${model => !model.Container || model.updating.includes(model.Container?.Identifier) || model.pasting}
                :innerHTML=${() => IconSynchronize}
                @click=${(model, ctx) => model.UpdateEntries(ctx.event)}>
            </fluent-button>
            ${model => model.bookmark ? starred : unstarred}
            <fluent-button
                icon-only
                id="paste-clipboard-button"
                appearance="transparent"
                title="${model => model.Localization.Locale.Frontend_FluentCore_MediaTitleSelect_PasteClipboardButton_Description()}"
                ?disabled=${model => model.updating.includes(model.Container?.Identifier) || model.pasting}
                :innerHTML=${() => IconClipboard}
                @click="${(model, ctx) => model.PasteClipboard(ctx.event)}">
            </fluent-button>
        </div>
    </div>
    <div id="dropdown" ${ref('dropdown')}>
        <div id="searchcontrol">
            <fluent-searchbox id="searchbox" ${ref('searchbox')} placeholder="${model => model.Localization.Locale.Frontend_FluentCore_MediaTitleSelect_SearchBox_Placeholder()}" allowcase allowregex @predicate=${(model, ctx) => model.Match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
        </div>
        <fluent-lazy-scroll id="entries" :Items=${model => model.filtered} :template=${CreateItemTemplate}></fluent-lazy-scroll>
    </div>
`;

export class MediaTitleSelect extends FASTElement {

    @LocalizationProviderRegistration Localization: ILocalizationProvider;

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
        if (current !== previous) {
            this.BookmarksChanged(HakuNeko.BookmarkPlugin.Entries.Value, HakuNeko.BookmarkPlugin);
            this.$emit('selectedChanged', this.Selected);
        }
    }
    @observable Expanded = false;
    ExpandedChanged() {
        if (this.dropdown) {
            this.dropdown.style.display = this.Expanded ? 'block' : 'none';
            this.searchbox.Focus();
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

    public async AddBookmark(event: Event) {
        event.stopPropagation();
        if (this.Selected) {
            await HakuNeko.BookmarkPlugin.Add(this.Selected as MediaContainer<MediaContainer<MediaChild>>);
        }
    }

    public async RemoveBookmark(event: Event) {
        event.stopPropagation();
        if (this.Selected && HakuNeko.BookmarkPlugin.IsBookmarked(this.Selected)) {
            const bookmark = HakuNeko.BookmarkPlugin.Find(this.Selected);
            await HakuNeko.BookmarkPlugin.Remove(bookmark);
        }
    }

    private BookmarksChanged = function (this: MediaTitleSelect, _: ReadonlyArray<Bookmark>, sender: BookmarkPlugin) {
        this.bookmark = this.Selected && sender.IsBookmarked(this.Selected);
    }.bind(this);

    private PastedClipboardUrlChanged = async function (this: MediaTitleSelect, uri: URL) {
        try {
            this.pasting = true;
            for (const website of HakuNeko.PluginController.WebsitePlugins) {
                let media = await website.TryGetEntry(uri.href);
                if (media) {
                    media = HakuNeko.BookmarkPlugin.Entries.Value.find(entry => entry.IsSameAs(media)) ?? media;
                    await media.Update();
                    if (!this.Selected || !this.Selected.IsSameAs(media)) {
                        this.Selected = media;
                    }
                    return;
                }
            }
            throw new Exception(R.Frontend_Media_PasteLink_NotFoundError, uri.href);
        } catch (error) {
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
        } catch (error) {
            console.warn(error);
        }
    }
}

MediaTitleSelect.define({ name: 'fluent-media-title-select', template, styles });