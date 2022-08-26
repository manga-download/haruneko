import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable } from '@microsoft/fast-element';
import type { IMediaContainer } from '../../engine/providers/MediaPlugin';
import type { WebsiteSelect, MediaTitleSelect } from './components/_index';

const styles: ElementStyles = css`
    :host {
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        gap: 0;
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: min-content minmax(0, 1fr);
        height: 100vh;
        background-color: var(--neutral-layer-1);
        color: var(--neutral-foreground-rest);
        user-select: none;
    }

    #titlebar {
    }

    #panel {
        gap: calc(var(--base-height-multiplier) * 1px);
        margin: calc(var(--base-height-multiplier) * 1px);
        display: grid;
        grid-template-rows: minmax(0, 1fr);
        grid-template-columns: minmax(240px, 2fr) 3fr;
    }

    #sidepanel {
        display: flex;
        flex-direction: column;
        gap: calc(var(--base-height-multiplier) * 1px);
    }

    #mainpanel {
        gap: calc(var(--base-height-multiplier) * 1px);
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: min-content min-content minmax(0, 1fr);
    }

    #bookmark-list {
        flex: 1;
        min-height: 0;
        display: block;
        border: 1px dotted green;
    }

    #download-manager {
        flex: 1;
        min-height: 0;
        display: block;
        border: 1px dotted blue;
    }

    #content {
        border: 1px dotted red;
    }
`;

const template: ViewTemplate<App> = html`
    <fluent-titlebar id="titlebar"></fluent-titlebar>
    <div id="panel">
        <div id="sidepanel">
            <fluent-bookmark-list id="bookmark-list" @bookmarkClicked=${(model, ctx) => model.BookmarkClicked(ctx.event)}></fluent-bookmark-list>
            <fluent-download-manager id="download-manager"></fluent-download-manager>
        </div>
        <div id="mainpanel">
            <fluent-website-select id="website-select" :selected=${model => model.website}
                @selectedChanged=${(model, ctx) => model.WebsiteSelectedChanged(ctx.event)}
                @entriesUpdated=${(model, ctx) => model.WebsiteEntriesUpdated(ctx.event)}></fluent-website-select>
            <fluent-media-title-select id="media-select" :entries=${model => model.titles}
                @selectedChanged=${(model, ctx) => model.MediaTitleSelectedChanged(ctx.event)}
                @entriesUpdated=${(model, ctx) => model.MediaTitleEntriesUpdated(ctx.event)}></fluent-media-title-select>
            <fluent-media-item-list id="content" :entries=${model => model.items}></fluent-media-item-list>
        </div>
    </div>
`;

@customElement({ name: 'fluent-app', template, styles })
export default class App extends FASTElement {

    @observable website: IMediaContainer;
    @observable titles: IMediaContainer[];
    @observable items: IMediaContainer[];

    private get websiteselect() {
        return this.shadowRoot.querySelector('#website-select') as WebsiteSelect;
    }

    private get mediaselect() {
        return this.shadowRoot.querySelector('#media-select') as MediaTitleSelect;
    }

    public WebsiteSelectedChanged(event: Event) {
        const sender = event.currentTarget as WebsiteSelect;
        this.titles = sender?.selected?.Entries as IMediaContainer[];
        if(!sender?.selected?.IsSameAs(this.mediaselect.selected?.Parent)) {
            this.mediaselect.selected = undefined;
        }
    }

    public WebsiteEntriesUpdated(event: Event) {
        const sender = event.currentTarget as WebsiteSelect;
        this.titles = sender?.selected?.Entries as IMediaContainer[];
    }

    public MediaTitleSelectedChanged(event: Event) {
        const sender = event.currentTarget as MediaTitleSelect;
        this.items = sender?.selected?.Entries as IMediaContainer[];
        // TODO: Setting website e.g. due to paste may lead to livelock ...
        if(sender?.selected && !sender?.selected?.Parent?.IsSameAs(this.websiteselect.selected)) {
            this.websiteselect.selected = sender?.selected?.Parent;
        }
    }

    public MediaTitleEntriesUpdated(event: Event) {
        const sender = event.currentTarget as MediaTitleSelect;
        this.items = sender?.selected?.Entries as IMediaContainer[];
    }

    public BookmarkClicked(event: Event) {
        const bookmark = (event as CustomEvent<IMediaContainer>).detail;
        this.websiteselect.selected = bookmark?.Parent;
        this.mediaselect.selected = bookmark;
    }
}