import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable } from '@microsoft/fast-element';
import type { IMediaContainer } from '../../engine/providers/MediaPlugin';
import type { WebsitePlugin, MediaContainer } from './components/_index';

const styles: ElementStyles = css`
    :host {
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        gap: 0;
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: max-content max-content max-content auto;
        height: 100vh;
        background-color: var(--neutral-layer-1);
        color: var(--neutral-foreground-rest);
        user-select: none;
    }
    #titlebar {
    }
`;

const template: ViewTemplate<App> = html`
    <fluent-titlebar id="titlebar"></fluent-titlebar>
    <fluent-accordion-website :selected=${model => model.website} @changed=${(model, ctx) => model.WebsiteChanged(ctx.event.currentTarget as WebsitePlugin)}></fluent-accordion-website>
    <fluent-accordion-mediacontainer :parent=${model => model.website} @changed=${(model, ctx) => model.ContainerChanged(ctx.event.currentTarget as MediaContainer)}></fluent-accordion-mediacontainer>
    <div style="border: 1px dotted red;"></div>
`;

@customElement({ name: 'fluent-app', template, styles })
export default class App extends FASTElement {

    @observable website: IMediaContainer;

    public WebsiteChanged(sender: WebsitePlugin) {
        this.website = sender?.selected;
    }

    public ContainerChanged(sender: MediaContainer) {
        if(!this.website || !this.website.IsSameAs(sender?.selected?.Parent)) {
            this.website = sender?.selected?.Parent;
        }
    }
}