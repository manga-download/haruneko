import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat } from '@microsoft/fast-element';
import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';
import S from '../services/StateService';

import IconSearch from '@vscode/codicons/src/icons/search.svg?raw';

const styles: ElementStyles = css`
    :host {
        gap: calc(var(--design-unit) * 1px);
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: max-content 1fr;
        margin: calc(var(--base-height-multiplier) * 1px);
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
    #controls {
        display: flex;
        align-items: center;
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
        overflow-y: scroll;
        overflow-x: hidden;
    }
    #entries {
        margin: 0;
        padding: 0;
        list-style-type: none;
    }
    #entries li:hover {
        cursor: pointer;
        background-color: var(--neutral-fill-hover);
    }
    .hint {
        padding: calc(var(--design-unit) * 1px);
        color: var(--neutral-foreground-hint);
    }
`;

const listitem: ViewTemplate<IMediaContainer> = html`
    <li @click=${(model, ctx) => ctx.parent.SelectEntry(model)}>
        <div>${model => model.Title}</div>
        <div class="hint">${model => model.Identifier}</div>
    </li>
`;

const template: ViewTemplate<BookmarkList> = html`
    <div id="filters">
        <fluent-text-field id="searchbox" appearance="outline" placeholder="${() => S.Locale.Frontend_BarelyFluid_WebsitePlugin_SearchTextbox_Placeholder()}" @input=${(model, ctx) => model.filtertext = ctx.event.currentTarget['value']}>
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
        const pattern = new RegExp(this.filtertext, 'i');
        const entries = HakuNeko.BookmarkPlugin.Entries;
        this.entries = !this.filtertext ? entries : entries.filter(entry => {
            return pattern.test(entry.Title);
        });
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