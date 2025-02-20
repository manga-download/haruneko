import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat } from '@microsoft/fast-element';
import type { Bookmark } from '../../../engine/providers/Bookmark';
import { S /*, StateManagerService, type StateManager*/ } from '../services/StateManagerService';

const styles: ElementStyles = css`

    :host {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: min-content min-content minmax(0, 1fr);
    }

    #header {
        padding: var(--spacingHorizontalS);
        background-color: var(--colorNeutralBackground4);
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
        color: var(--colorNeutralForeground4);
    }

    .missing {
        opacity: 0.5;
    }

    #searchcontrol {
        padding: var(--spacingHorizontalS);
        border-top: var(--strokeWidthThin) solid var(--colorNeutralStrokeSubtle);
        border-bottom: var(--strokeWidthThin) solid var(--colorNeutralStrokeSubtle);
        background-color: var(--colorNeutralBackground4);
    }

    ul#entries {
        list-style-type: none;
        overflow-y: scroll;
        overflow-x: hidden;
        padding: 0;
        margin: 0;
    }

    ul#entries li {
        height: var(--fontSizeBase600);
        padding: var(--spacingHorizontalXS);
        border-top: var(--strokeWidthThin) solid var(--colorNeutralStrokeSubtle);
        gap: var(--spacingHorizontalXS);
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
        background-color: var(--colorNeutralBackground1Hover);
    }

    .icon {
        margin-right: var(--spacingHorizontalXS);
        height: inherit;
    }
`;

const listitem: ViewTemplate<Bookmark> = html`
    <li class=${model => model?.IsOrphaned ? 'missing' : ''} @click=${(model, ctx) => ctx.parent.SelectEntry(model)}>
        <img class="icon" src="${model => model.Parent.Icon}"></img>
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