import { FASTElement, html, css, observable } from '@microsoft/fast-element';
import type { Bookmark } from '../../../engine/providers/Bookmark';
import { LocalizationProviderRegistration, type ILocalizationProvider } from '../services/LocalizationProvider';
import { CreateMediaItemTemplate } from './MediaItemEntry';

const styles = css`

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

    #entries {
        padding: 0;
        margin: 0;
    }
`;

const template = html<BookmarkList>`
    <div id="header">
        <div id="title">${model => model.Localization.Locale.Frontend_FluentCore_BookmarkList_Heading()}</div>
        <div class="hint">${model => model.filtered?.length ?? '┄'}／${model => model.Entries?.length ?? '┄'}</div>
    </div>
    <div id="searchcontrol">
        <fluent-searchbox placeholder="" @predicate=${(model, ctx) => model.Match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
    </div>
    <fluent-lazy-scroll id="entries" :Items=${model => model.filtered} :Template=${model => CreateMediaItemTemplate<Bookmark>(model.SelectEntry.bind(model), item => !item?.IsOrphaned)}></fluent-lazy-scroll>
`;

export class BookmarkList extends FASTElement {

    @LocalizationProviderRegistration Localization: ILocalizationProvider;

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
        // TODO: Sort entries?
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
        // TODO: LazyScroll
        this.filtered = this.Entries.filter(entry => this.Match(entry.Title));//.slice(0, 500);
    }

    private BookmarksChanged = function (this: BookmarkList) {
        this.Entries = HakuNeko.BookmarkPlugin.Entries.Value.slice();
    }.bind(this);
}

BookmarkList.define({ name: 'fluent-bookmark-list', template, styles });