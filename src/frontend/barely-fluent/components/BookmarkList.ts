import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat } from '@microsoft/fast-element';
import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';
import S from '../services/StateService';

import IconSearch from '@vscode/codicons/src/icons/search.svg?raw';

const styles: ElementStyles = css`
    :host {
        gap: calc(var(--design-unit) * 1px);
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: max-content minmax(0, 1fr);
    }

    #searchpattern {
        width: 100%;
    }

    #searchpattern svg {
        width: 100%;
        height: 100%;
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
    <div id="searchcontrol">
        <fluent-text-field id="searchpattern" appearance="outline" placeholder="${() => S.Locale.Frontend_BarelyFluid_WebsitePlugin_SearchTextbox_Placeholder()}" @input=${(model, ctx) => model.filtertext = ctx.event.currentTarget['value']}>
            <div slot="start">${IconSearch}</div>    
            <!-- ${() => S.Locale.Frontend_BarelyFluid_WebsitePlugin_SearchTextbox_Label()} -->
        </fluent-text-field>
        <fluent-divider></fluent-divider>
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

    @observable entries: IMediaContainer[];
    @observable updating = false;
    @observable filtertext = '';
    filtertextChanged(previous: typeof this.filtertext, current: typeof this.filtertext) {
        if(previous !== current) {
            this.FilterEntries();
        }
    }

    public async FilterEntries() {
        let filtered = HakuNeko.BookmarkPlugin.Entries;
        try {
            const pattern = this.filtertext?.toLowerCase();
            filtered = !pattern ? filtered : filtered.filter(entry => entry.Title.toLowerCase().includes(pattern));
        } catch { /* ignore errors */ }
        this.entries = filtered.slice(0, 250); // TODO: virtual scrolling
    }

    public SelectEntry(entry: IMediaContainer) {
        this.$emit('bookmarkClicked', entry);
    }

    public async UpdateEntries(): Promise<void> {
        /*
        try {
            this.updating = true;
            await this.selected?.Update();
        } catch(error) {
            console.warn(error);
        } finally {
            this.updating = false;
        }
        */
    }

    public RemoveBookmark() {
        console.log('Removed Bookmark');
    }

    private BookmarksChanged = function() {
        this.FilterEntries();
    }.bind(this);
}