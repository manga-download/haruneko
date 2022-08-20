import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, when, repeat, Observable } from '@microsoft/fast-element';
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
        margin: calc(var(--base-height-multiplier) * 1px);
    }

    /*
    #busy-status {
        margin: calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 0.25 * 1px);
        width: calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 0.75 * 1px);
        height: calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 0.75 * 1px);
    }
    #panel {
    }
    */

    #heading {
        padding: calc(var(--base-height-multiplier) * 1px);
        gap: calc(var(--base-height-multiplier) * 1px);
        display: grid;
        align-items: center;
        grid-template-columns: max-content 1fr max-content;
    }

    #heading #logo {
        height: calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px);
    }

    #heading #title {
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        cursor: pointer;
    }

    #controls {
        display: flex;
        align-items: center;
    }

    #dropdown {
        height: 100%;
        display: none;
    }

    #searchcontrol {
        padding: calc(var(--base-height-multiplier) * 1px);
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        border-bottom: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
    }

    #searchpattern {
        width: 50%;
    }

    #searchpattern svg {
        width: 100%;
        height: 100%;
    }

    #button-update-entries.updating svg {
        animation: spinning 1.5s linear infinite;
    }

    @keyframes spinning {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    #entries {
        max-height: 240px;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    ul#entries {
        list-style-type: none;
        padding: 0;
    }

    ul#entries li {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    ul#entries li:hover {
        cursor: pointer;
        background-color: var(--neutral-fill-hover);
    }

    .icon {
        flex: 0;
        width: 2em;
        height: 2em;
    }

    .foo {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .hint {
        padding: calc(var(--design-unit) * 1px);
        color: var(--neutral-foreground-hint);
    }
`;

const listitem: ViewTemplate<IMediaContainer> = html`
    <li @click=${(model, ctx) => ctx.parent.SelectEntry(model)}>
        <img class="icon" src="${model => model.Icon}"></img>
        <div class="foo">
            <div style="font-weight: bold;">${model => model.Title}</div>
            <div class="hint">${model => model.Identifier}</div>
        </div>
    </li>
`;

const template: ViewTemplate<WebsiteSelect> = html`
    <ul id="entries">
        ${repeat(model => model.entries, listitem)}
    </ul>
`;

@customElement({ name: 'fluent-website-select', template, styles })
export class WebsiteSelect extends FASTElement {

    @observable entries: IMediaContainer[];
    @observable selected: IMediaContainer = HakuNeko.PluginController.WebsitePlugins[4];
    selectedChanged(previous: IMediaContainer, current: IMediaContainer) {
        if(!previous || !previous.IsSameAs(current)) {
            this.$emit('selectedChanged');
        }
    }
    @observable filtertext = '';
    filtertextChanged(previous: typeof this.filtertext, current: typeof this.filtertext) {
        if(previous !== current) {
            this.FilterEntries();
        }
    }

    private get dropdown(): HTMLElement {
        return this.shadowRoot.querySelector('#dropdown') as HTMLElement;
    }

    public async FilterEntries() {
        const pattern = new RegExp(this.filtertext, 'i');
        this.entries = HakuNeko.PluginController.WebsitePlugins.filter(entry => {
            // TODO: consider tags ...
            return pattern.test(entry.Title);
        });
    }

    public SelectEntry(entry: IMediaContainer) {
        this.selected = entry;
        this.expanded = false;
        Observable.notify(this, 'expanded'); // force update of UI even when property not changed
    }

    public async UpdateEntries(): Promise<void> {
        try {
            this.updating = true;
            await this.selected?.Update();
        } catch(error) {
            console.warn(error);
        } finally {
            this.updating = false;
            this.$emit('entriesUpdated');
        }
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