import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat } from '@microsoft/fast-element';
import type { IMediaContainer } from '../../engine/providers/MediaPlugin';
import type { WebsitePlugin, MediaContainer } from './components/_index';

const styles: ElementStyles = css`
    :host {
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        gap: 0;
        display: grid;
        grid-template-columns: minmax(240px, 320px) auto;
        grid-template-rows: min-content min-content min-content 1fr;
        height: 100vh;
        background-color: var(--neutral-layer-1);
        color: var(--neutral-foreground-rest);
        user-select: none;
    }
    #titlebar {
        grid-column: 1 / -1;
    }
    #bookmarks {
        grid-row: 2 / -1;
    }
    #content {
        border: 1px dotted red;
        overflow-x: hidden;
        overflow-y: scroll;
    }
`;

const template: ViewTemplate<App> = html`
    <fluent-titlebar id="titlebar"></fluent-titlebar>
    <fluent-bookmarks id="bookmarks"></fluent-bookmarks>
    <fluent-accordion-website :selected=${model => model.website} @changed=${(model, ctx) => model.WebsiteChanged(ctx.event.currentTarget as WebsitePlugin)}></fluent-accordion-website>
    <fluent-accordion-mediacontainer :parent=${model => model.website} @changed=${(model, ctx) => model.ContainerChanged(ctx.event.currentTarget as MediaContainer)}></fluent-accordion-mediacontainer>
    <div id="content">
        ${repeat(model => model.container?.Entries, html`<div>${entry => entry.Title}</div>`)}
    </div>
`;

@customElement({ name: 'fluent-app', template, styles })
export default class App extends FASTElement {

    @observable website: IMediaContainer;
    @observable container: IMediaContainer;

    public WebsiteChanged(sender: WebsitePlugin) {
        this.website = sender?.selected;
    }

    public ContainerChanged(sender: MediaContainer) {
        this.container = sender?.selected;
        if(!this.website || !this.website.IsSameAs(sender?.selected?.Parent)) {
            this.website = sender?.selected?.Parent;
        }
    }
}