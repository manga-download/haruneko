import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, when } from '@microsoft/fast-element';
import type { MediaContainer, MediaChild } from '../../engine/providers/MediaPlugin';
import S from './services/StateService';

const styles: ElementStyles = css`
    :host {
        /* Extend/Override the default value of '--body-font' to support colored emoji flags */
        --body-font: NotoColorEmoji-Flags, 'Segoe UI Variable', 'Segoe UI', sans-serif;

        font-family: var(--body-font);
        font-size: var(--type-ramp-base-font-size);
        gap: 0;
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: min-content min-content minmax(0, 1fr);
        border: 1px var(--neutral-stroke-layer-active) solid;
        border-radius: calc(1.25px * var(--layer-corner-radius));
        height: calc(100vh - 2px * var(--stroke-width));
        background-color: var(--neutral-layer-1);
        color: var(--neutral-foreground-rest);
        user-select: none;
    }

    #titlebar {
    }

    #widgets {
        display: flex;
        flex-direction: row;
        gap: calc(var(--base-height-multiplier) * 1px);
        margin: calc(var(--base-height-multiplier) * 1px);
    }

    #preview {
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

const templateSidePanel: ViewTemplate<App> = html`
    <div id="sidepanel">
        <fluent-card id="bookmark-list-panel" style="display: ${() => S.SettingPanelBookmarks ? 'block' : 'none'}">
            <fluent-bookmark-list id="bookmark-list"
                @bookmarkClicked=${(model, ctx) => model.selectedTitle = (ctx.event as CustomEvent<MediaContainer<MediaChild>>).detail}></fluent-bookmark-list>
        </fluent-card>
        <fluent-card id="download-manager-panel" style="display: ${() => S.SettingPanelDownloads ? 'block' : 'none'}">
            <fluent-download-manager id="download-manager"></fluent-download-manager>
        </fluent-card>
    </div>
`;

const templateWidgets: ViewTemplate<App> = html`
    <div id="widgets">
        ${when(() => S.SettingPanelBookmarks || S.SettingPanelDownloads, templateSidePanel)}
        <div id="mainpanel">
            <fluent-card>
                <fluent-website-select id="website-select" :Entries=${() => HakuNeko.PluginController.WebsitePlugins} :Selected=${model => model.selectedWebsite}
                    @selectedChanged=${(model, ctx) => model.SelectedWebsiteChanged(ctx.event as CustomEvent<MediaContainer<MediaChild>>)}>
                </fluent-website-select>
            </fluent-card>
            <fluent-card>
                <fluent-media-title-select id="media-title-select" :Container=${model => model.selectedWebsite} :Selected=${model => model.selectedTitle}
                    @selectedChanged=${(model, ctx) => model.SelectedMediaTitleChanged(ctx.event as CustomEvent<MediaContainer<MediaChild>>)}>
                </fluent-media-title-select>
            </fluent-card>
            <fluent-card>
                <fluent-media-item-list id="media-item-list" :Container=${model => model.selectedTitle}
                    @previewClicked=${(model, ctx) => model.previewEntry = (ctx.event as CustomEvent<MediaContainer<MediaChild>>).detail}></fluent-media-item-list>
            </fluent-card>
        </div>
    </div>
`;

const templatePreview: ViewTemplate<App> = html`
    <fluent-media-item-preview id="preview" :Entry=${model => model.previewEntry}
        @entryChanged=${(model, ctx) => model.previewEntry = (ctx.event as CustomEvent<MediaContainer<MediaChild>>).detail}></fluent-media-item-preview>
`;

const template: ViewTemplate<App> = html`
    <fluent-settings-dialog></fluent-settings-dialog>
    <fluent-titlebar id="titlebar"></fluent-titlebar>
    ${when(model => !model.previewEntry, templateWidgets)}
    ${when(model => model.previewEntry, templatePreview)}
`;

@customElement({ name: 'fluent-app', template, styles })
export default class App extends FASTElement {

    @observable selectedWebsite: MediaContainer<MediaChild>;
    @observable selectedTitle: MediaContainer<MediaChild>;
    @observable previewEntry: MediaContainer<MediaChild>;

    public SelectedWebsiteChanged(event: CustomEvent<MediaContainer<MediaChild>>) {
        this.selectedWebsite = event.detail;
        if(!this.selectedWebsite?.IsSameAs(this.selectedTitle?.Parent)) {
            this.selectedTitle = undefined;
        }
    }

    public SelectedMediaTitleChanged(event: CustomEvent<MediaContainer<MediaChild>>) {
        this.selectedTitle = event.detail;
        if(this.selectedTitle && (this.selectedWebsite || this.selectedTitle?.Parent) && !this.selectedWebsite?.IsSameAs(this.selectedTitle?.Parent)) {
            this.selectedWebsite = this.selectedTitle?.Parent;
        }
    }
}