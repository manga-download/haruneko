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
        display: flex;
        flex-direction: row;
        gap: calc(var(--base-height-multiplier) * 1px);
        margin: calc(var(--base-height-multiplier) * 1px);
    }

    #sidepanel {
        flex: 2;
        display: flex;
        flex-direction: column;
        gap: calc(var(--base-height-multiplier) * 1px);
    }

    #mainpanel {
        flex: 3;
        gap: calc(var(--base-height-multiplier) * 1px);
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: min-content min-content minmax(0, 1fr);
    }

    #bookmark-list-panel {
        flex: 1;
        min-height: 0;
        /*border: 1px dotted green;*/
    }

    #download-manager-panel {
        flex: 1;
        min-height: 0;
        /*border: 1px dotted blue;*/
    }

    #bookmark-list, #download-manager, #website-select, #media-title-select, #media-item-list {
        height: 100%;
    }
`;

const template: ViewTemplate<App> = html`
    <fluent-titlebar id="titlebar"></fluent-titlebar>
    <div id="panel">
        <div id="sidepanel">
            <fluent-card id="bookmark-list-panel">
                <fluent-bookmark-list id="bookmark-list" @bookmarkClicked=${(model, ctx) => model.BookmarkClicked(ctx.event)}></fluent-bookmark-list>
            </fluent-card>
            <fluent-card id="download-manager-panel">
                <fluent-download-manager id="download-manager"></fluent-download-manager>
            </fluent-card>
        </div>
        <div id="mainpanel">
            <fluent-card>
                <fluent-website-select id="website-select" :selected=${model => model.website}
                    @selectedChanged=${(model, ctx) => model.WebsiteSelectedChanged(ctx.event)}
                    @entriesUpdated=${(model, ctx) => model.WebsiteEntriesUpdated(ctx.event)}>
                </fluent-website-select>
            </fluent-card>
            <fluent-card>
                <fluent-media-title-select id="media-title-select" :entries=${model => model.titles}
                    @selectedChanged=${(model, ctx) => model.MediaTitleSelectedChanged(ctx.event)}
                    @entriesUpdated=${(model, ctx) => model.MediaTitleEntriesUpdated(ctx.event)}>
                </fluent-media-title-select>
            </fluent-card>
            <fluent-card>
                <fluent-media-item-list id="media-item-list" :entries=${model => model.items}></fluent-media-item-list>
            </fluent-card>
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
        return this.shadowRoot.querySelector('#media-title-select') as MediaTitleSelect;
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