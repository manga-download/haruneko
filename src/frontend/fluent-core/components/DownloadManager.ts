import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat } from '@microsoft/fast-element';
//import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';
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
        grid-template-columns: min-content 1fr min-content;
    }

    ul#entries li > div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    ul#entries li .controls {
        display: flex;
    }

    ul#entries li:hover {
        background-color: var(--neutral-fill-hover);
    }

    .icon {
        margin-right: calc(var(--design-unit) * 1px);
        height: inherit;
    }
`;

const listitem: ViewTemplate<number> = html`
    <li>
        <div class="icon">[ICO]</div>
        <div>[Title] ${model => model}</div>
        <div class="controls">
            <div>[ X ]</div>
        </div>
    </li>
`;

const template: ViewTemplate<DownloadManager> = html`
    <div id="header">[ LOCALE:Downloads ]</div>
    <div id="searchcontrol">
        <fluent-searchbox placeholder="" @predicate=${(model, ctx) => model.match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
    </div>
    <ul id="entries">
        ${repeat(model => model.entries, listitem)}
    </ul>
`;

@customElement({ name: 'fluent-download-manager', template, styles })
export class DownloadManager extends FASTElement {

    override connectedCallback(): void {
        super.connectedCallback();
        //HakuNeko.BookmarkPlugin.EntriesUpdated.Subscribe(this.BookmarksChanged);
        this.FilterEntries();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        //HakuNeko.BookmarkPlugin.EntriesUpdated.Unsubscribe(this.BookmarksChanged);
    }

    @observable entries: number[] = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ]; // HakuNeko.BookmarkPlugin.Entries;
    @observable match: (text: string) => boolean = () => true;
    matchChanged() {
        this.FilterEntries();
    }

    public async FilterEntries() {
        //this.entries = HakuNeko.BookmarkPlugin.Entries.filter(entry => this.match(entry.Title)).slice(0, 250); /* TODO: virtual scrolling */
    }
}