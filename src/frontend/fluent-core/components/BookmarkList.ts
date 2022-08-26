import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat } from '@microsoft/fast-element';
import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';
//import S from '../services/StateService';

const styles: ElementStyles = css`
    :host {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: min-content min-content minmax(0, 1fr);
    }

    #header {
        padding: calc(var(--base-height-multiplier) * 1px);
        background-color: var(--neutral-layer-2);
        font-weight: bold;
    }

    #searchcontrol {
        padding: calc(var(--base-height-multiplier) * 1px);
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        border-bottom: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
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
    }
`;

const listitem: ViewTemplate<IMediaContainer> = html`
    <li @click=${(model, ctx) => ctx.parent.SelectEntry(model)}>
        <img class="icon" src="${model => model.Parent?.Icon}"></img>
        <div>${model => model.Title}</div>
    </li>
`;

const template: ViewTemplate<BookmarkList> = html`
    <div id="header">[ LOCALE:Bookmarks ]</div>
    <div id="searchcontrol">
        <fluent-searchbox placeholder="" @predicate=${(model, ctx) => model.match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
    </div>
    <ul id="entries">
        ${repeat(model => model.entries, listitem)}
    </ul>
`;

@customElement({ name: 'fluent-bookmark-list', template, styles })
export class BookmarkList extends FASTElement {

    override connectedCallback(): void {
        super.connectedCallback();
        HakuNeko.BookmarkPlugin.EntriesUpdated.Subscribe(this.BookmarksChanged);
        this.FilterEntries();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        HakuNeko.BookmarkPlugin.EntriesUpdated.Unsubscribe(this.BookmarksChanged);
    }

    @observable entries: IMediaContainer[] = HakuNeko.BookmarkPlugin.Entries;
    @observable match: (text: string) => boolean = () => true;
    matchChanged() {
        this.FilterEntries();
    }
    @observable updating = false;

    public async FilterEntries() {
        this.entries = HakuNeko.BookmarkPlugin.Entries.filter(entry => this.match(entry.Title)).slice(0, 250); /* TODO: virtual scrolling */
    }

    public SelectEntry(entry: IMediaContainer) {
        this.$emit('bookmarkClicked', entry);
    }

    private BookmarksChanged = function() {
        this.FilterEntries();
    }.bind(this);
}