import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat } from '@microsoft/fast-element';
import type { IMediaContainer } from '../../engine/providers/MediaPlugin';
import type { WebsiteSelect, MediaTitleSelect } from './components/_index';

import IconSettings from '@fluentui/svg-icons/icons/settings_20_regular.svg?raw';
import IconBookmarkList from '@fluentui/svg-icons/icons/bookmark_multiple_20_regular.svg?raw';
import IconDownloadManager from '@fluentui/svg-icons/icons/arrow_download_20_regular.svg?raw';

const styles: ElementStyles = css`
    :host {
        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        gap: 0;
        display: grid;
        grid-template-columns: minmax(240px, 320px) 1fr;
        grid-template-rows: min-content min-content min-content 1fr;
        height: 100vh;
        background-color: var(--neutral-layer-1);
        color: var(--neutral-foreground-rest);
        user-select: none;
    }
    #titlebar {
        grid-column: 1 / -1;
    }
    #bookmark-list {
        grid-row: 2 / -1;
    }
    #content {
        border: 1px dotted red;
        overflow-x: hidden;
        overflow-y: scroll;
        margin: calc(var(--base-height-multiplier) * 1px);
    }
`;

const template: ViewTemplate<App> = html`
    <fluent-titlebar id="titlebar"></fluent-titlebar>
    <!--
    <fluent-menu id="menu">
        <fluent-menu-item role="menuitemcheckbox">Foo</fluent-menu-item>
        <fluent-menu-item role="menuitemcheckbox">Bar</fluent-menu-item>
        <fluent-divider></fluent-divider>
        <fluent-menu-item role="menuitemradio">${IconBookmarkList} LOCALE:Menu_Bookmarks</fluent-menu-item>
        <fluent-menu-item role="menuitemradio">LOCALE:Menu_Downloads</fluent-menu-item>
        <fluent-divider></fluent-divider>
        <fluent-menu-item>${IconSettings} LOCALE:Menu_Settings</fluent-menu-item>
    </fluent-menu>
    -->
    <fluent-bookmark-list id="bookmark-list" @bookmarkClicked=${(model, ctx) => model.BookmarkClicked(ctx.event)}></fluent-bookmark-list>
    <fluent-website-select id="website-select" :selected=${model => model.website}
        @selectedChanged=${(model, ctx) => model.WebsiteSelectedChanged(ctx.event)}
        @entriesUpdated=${(model, ctx) => model.WebsiteEntriesUpdated(ctx.event)}></fluent-website-select>
    <fluent-media-title-select id="media-select" :entries=${model => model.titles}
        @selectedChanged=${(model, ctx) => model.MediaTitleSelectedChanged(ctx.event)}
        @entriesUpdated=${(model, ctx) => model.MediaTitleEntriesUpdated(ctx.event)}></fluent-media-title-select>
    <div id="content">
        ${repeat(model => model.items, html`<div>${entry => entry.Title}</div>`)}
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
    }

    public WebsiteEntriesUpdated(event: Event) {
        const sender = event.currentTarget as WebsiteSelect;
        this.titles = sender?.selected?.Entries as IMediaContainer[];
    }

    public MediaTitleSelectedChanged(event: Event) {
        const sender = event.currentTarget as MediaTitleSelect;
        this.items = sender?.selected?.Entries as IMediaContainer[];
        // TODO: Setting website e.g. due to paste may lead to livelock ...
        //this.websiteselect.selected = sender?.selected?.Parent;
    }

    public MediaTitleEntriesUpdated(event: Event) {
        const sender = event.currentTarget as MediaTitleSelect;
        this.items = sender?.selected?.Entries as IMediaContainer[];
    }

    public BookmarkClicked(event: Event) {
        const bookmark = (event as CustomEvent<IMediaContainer>).detail;
        this.mediaselect.selected = bookmark;
        this.websiteselect.selected = bookmark?.Parent;
    }
}