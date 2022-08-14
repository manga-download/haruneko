import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, when, repeat } from '@microsoft/fast-element';
import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';
import S from '../services/StateService';

import IconSearch from '@vscode/codicons/src/icons/search.svg?raw';
import IconSynchronize from '@vscode/codicons/src/icons/sync.svg?raw';
import IconSettings from '@fluentui/svg-icons/icons/settings_20_regular.svg?raw';
//import IconFavorite from '@fluentui/svg-icons/icons/star_20_regular.svg?raw';
import IconAddFavorite from '@fluentui/svg-icons/icons/star_off_20_regular.svg?raw';
import IconRemoveFavorite from '@fluentui/svg-icons/icons/star_20_filled.svg?raw';

const styles: ElementStyles = css`
    :host {
        /*border: 2px dotted grey;*/
    }
    #logo {
        height: 32px;
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
    #busy-status {
        margin: calc(var(--design-unit) * 1px);
        width: calc((var(--base-height-multiplier) + var(--density) - 2) * var(--design-unit) * 1px);
        height: calc((var(--base-height-multiplier) + var(--density) - 2) * var(--design-unit) * 1px);
    }
    #panel {
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
        max-height: 240px;
        overflow-y: scroll;
        overflow-x: hidden;
    }
`;

const selected: ViewTemplate<WebsitePlugin> = html`
    <img id="logo" slot="start" src="${model => model.selected.Icon}"></img>
    <div id="title" slot="heading">
        ${model => model.selected.Title} (${model => model.updating ? '?' : model.selected.Entries.length})
    </div>
`;

const busy: ViewTemplate<WebsitePlugin> = html`
    <fluent-progress-ring id="busy-status"></fluent-progress-ring>
    <fluent-tooltip anchor="busy-status">${() => S.Locale.Frontend_BarelyFluid_WebsitePlugin_BusyStatus_Description()}</fluent-tooltip>
`;

const unstarred: ViewTemplate<WebsitePlugin> = html`
    <fluent-button id="add-favorite-button" appearance="stealth" ?disabled=${model => !model.selected} @click=${model => model.AddFavorite()}>${IconAddFavorite}</fluent-button>
    <fluent-tooltip anchor="add-favorite-button">${() => S.Locale.Frontend_BarelyFluid_WebsitePlugin_AddFavoriteButton_Description()}</fluent-tooltip>
`;

const starred: ViewTemplate<WebsitePlugin> = html`
    <fluent-button id="remove-favorite-button" appearance="stealth" ?disabled=${model => !model.selected} @click=${model => model.RemoveFavorite()}>${IconRemoveFavorite}</fluent-button>
    <fluent-tooltip anchor="remove-favorite-button">${() => S.Locale.Frontend_BarelyFluid_WebsitePlugin_RemoveFavoriteButton_Description()}</fluent-tooltip>
`;

const listitem: ViewTemplate<IMediaContainer> = html`
    <li>
        <div>${model => model.Title}</div>
        <div style="color: var(--neutral-foreground-hint)">${model => model.Identifier}</div>
    </li>
`;

const template: ViewTemplate<WebsitePlugin> = html`
    <fluent-accordion-item>
        ${when(model => model.selected, selected)}
        <div id="controls" slot="end">
            ${when(model => model.updating, busy)}
            <fluent-button id="update-entries-button" appearance="stealth" ?disabled=${model => !model.selected || model.updating} @click=${model => model.UpdateEntries()}>${IconSynchronize}</fluent-button>
            <fluent-tooltip anchor="update-entries-button">${() => S.Locale.Frontend_BarelyFluid_WebsitePlugin_UpdateEntriesButton_Description()}</fluent-tooltip>
            ${model => model.favorite ? starred : unstarred}
            <fluent-button id="buttonOpenSettings" appearance="stealth" ?disabled=${model => !model.selected} @click="${model => model.OpenSettings()}">${IconSettings}</fluent-button>
            <fluent-tooltip anchor="buttonOpenSettings">${() => S.Locale.Frontend_BarelyFluid_WebsitePlugin_OpenSettingsButton_Description()}</fluent-tooltip>
        </div>
        <div id="panel">
            <div id="filters">
                <fluent-text-field id="searchbox" appearance="outline" placeholder="${() => S.Locale.Frontend_BarelyFluid_WebsitePlugin_SearchTextbox_Placeholder()}" @input=${(model, ctx) => model.filtertext = ctx.event.currentTarget['value']}>
                <div slot="start">${IconSearch}</div>    
                <!-- ${() => S.Locale.Frontend_BarelyFluid_WebsitePlugin_SearchTextbox_Label()} -->
                </fluent-text-field>
            </div>
            <fluent-divider></fluent-divider>
            <div id="entries">
                <ul>
                    ${repeat(model => model.entries, listitem)}
                </ul>
            </div>
        </div>
    </fluent-accordion-item>
`;

@customElement({ name: 'fluent-accordion-website', template, styles })
export class WebsitePlugin extends FASTElement {

    @observable entries = HakuNeko.PluginController.WebsitePlugins;
    @observable selected: IMediaContainer = HakuNeko.PluginController.WebsitePlugins[4];
    selectedChanged(previous: IMediaContainer, current: IMediaContainer) {
        if(!previous || !previous.IsSameAs(current)) {
            this.$emit('changed');
        }
    }
    @observable updating = false;
    @observable favorite = false;
    @observable filtertext = '';
    filtertextChanged(previous: typeof this.filtertext, current: typeof this.filtertext) {
        if(previous !== current) {
            this.FilterEntries();
        }
    }

    public async FilterEntries() {
        const pattern = new RegExp(this.filtertext, 'i');
        this.entries = HakuNeko.PluginController.WebsitePlugins.filter(entry => {
            // TODO: consider tags ...
            return pattern.test(entry.Title);
        });
    }

    public async UpdateEntries(): Promise<void> {
        this.updating = true;
        await this.selected?.Update();
        this.updating = false;
    }

    public AddFavorite() {
        this.favorite = true;
        console.log('Added Favorite', this.selected?.Identifier);
    }

    public RemoveFavorite() {
        this.favorite = false;
        console.log('Removed Favorite', this.selected?.Identifier);
    }

    public OpenSettings() {
        console.log('Open Settings', this.selected?.Identifier);
    }
}