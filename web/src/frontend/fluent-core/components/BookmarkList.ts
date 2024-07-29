import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat } from '@microsoft/fast-element';
import type { Bookmark } from '../../../engine/providers/Bookmark';
import S from '../services/StateService';

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

    .hint {
        color: var(--neutral-foreground-hint);
    }

    .missing {
        opacity: 0.5;
    }

    #searchcontrol {
        padding: calc(var(--base-height-multiplier) * 1px);
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        border-bottom: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        background-color: var(--neutral-layer-2);
    }

    ul#entries {
        list-style-type: none;
        overflow-y: scroll;
        overflow-x: hidden;
        padding: 0;
        margin: 0;
    }

    ul#entries li {
        height: 24px; /* calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px); */
        padding: calc(var(--design-unit) * 1px);
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        gap: calc(var(--design-unit) * 1px);
        display: grid;
        align-items: center;
        grid-template-rows: min-content;
        grid-template-columns: min-content min-content 1fr;
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
    }
`;

const listitem: ViewTemplate<Bookmark> = html`
    <li class=${model => model?.IsOrphaned ? 'missing' : ''} @click=${(model, ctx) => ctx.parent.SelectEntry(model)}>
        <img class="icon" src="${model => model.Parent.Icon}"></img>
        <!--
        <img class="icon" src="${model => model.Icon}"></img>
        -->
        <div>${model => model.Title}</div>
    </li>
`;

const template: ViewTemplate<BookmarkList> = html`
    <div id="header">
        <div id="title">${() => S.Locale.Frontend_FluentCore_BookmarkList_Heading()}</div>
        <div class="hint">${model => model.filtered?.length ?? '┄'}／${model => model.Entries?.length ?? '┄'}</div>
    </div>
    <div id="searchcontrol">
        <fluent-searchbox placeholder="" @predicate=${(model, ctx) => model.Match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
    </div>
    <ul id="entries">
        ${repeat(model => model.filtered, listitem)}
    </ul>
`;

@customElement({ name: 'fluent-bookmark-list', template, styles })
export class BookmarkList extends FASTElement {

    override connectedCallback(): void {
        super.connectedCallback();
        HakuNeko.BookmarkPlugin.Entries.Subscribe(this.BookmarksChanged);
        this.BookmarksChanged();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        HakuNeko.BookmarkPlugin.Entries.Unsubscribe(this.BookmarksChanged);
    }

    @observable Entries: Bookmark[] = [];
    EntriesChanged() {
        this.FilterEntries();
    }
    @observable Match: (text: string) => boolean = () => true;
    MatchChanged() {
        this.FilterEntries();
    }
    @observable filtered: Bookmark[] = [];
    @observable updating = false;

    public SelectEntry(entry: Bookmark) {
        this.$emit('bookmarkClicked', entry);
    }

    public FilterEntries() {
        this.filtered = this.Entries.filter(entry => this.Match(entry.Title)).slice(0, 500); /* TODO: virtual scrolling */
    }

    private BookmarksChanged = function(this: BookmarkList) {
        this.Entries = HakuNeko.BookmarkPlugin.Entries.Value.slice();
    }.bind(this);
}