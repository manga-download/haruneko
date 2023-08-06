import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, Observable, ref } from '@microsoft/fast-element';
import type { IMediaContainer } from '../../../engine/providers/MediaPlugin';
import S from '../services/StateService';

import IconSettings from '@fluentui/svg-icons/icons/settings_20_regular.svg?raw';
//import IconFavorite from '@fluentui/svg-icons/icons/star_20_regular.svg?raw';
import IconAddFavorite from '@fluentui/svg-icons/icons/star_off_20_regular.svg?raw';
import IconRemoveFavorite from '@fluentui/svg-icons/icons/star_20_filled.svg?raw';

// #entries .entry
const styleEntries = [
    'height: 42px;',
    'padding: calc(var(--design-unit) * 1px);',
    'border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);',
    'gap: calc(var(--design-unit) * 1px);',
    'display: grid;',
    'grid-template-rows: min-content 1fr;',
    'grid-template-columns: min-content 1fr;',
    // HACK: => hovered cursor
    'cursor: pointer;',
].join(' ');

// #entries .entry:hover
// cursor: pointer;
// background-color: var(--neutral-fill-hover);

// #entries .entry > div
const styleTrim = [
    'overflow: hidden;',
    'white-space: nowrap;',
    'text-overflow: ellipsis;',
].join(' ');

// #entries .entry > .title
const styleTitle = styleTrim + ' font-weight: bold;';

// .hint
const styleHint = styleTrim + ' color: var(--neutral-foreground-hint);';

// .icon
const styleIcon = [
    'margin-right: calc(var(--design-unit) * 1px);',
    'height: inherit;',
    'grid-row: 1 / -1;',
].join(' ');

const styles: ElementStyles = css`

    :host {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: min-content minmax(0, 1fr);
    }

    #heading {
        background-color: var(--neutral-layer-2);
        padding: calc(var(--design-unit) * 1px);
        gap: calc(var(--base-height-multiplier) * 1px);
        display: grid;
        align-items: center;
        grid-template-columns: max-content 1fr max-content;
    }

    #heading:hover {
        cursor: pointer;
        background-color: var(--neutral-fill-hover);
    }

    #heading #logo {
        height: calc((var(--base-height-multiplier) + var(--density)) * var(--design-unit) * 1px);
    }

    #heading #title {
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    #controls {
        display: flex;
        align-items: center;
    }

    #controls .hint {
        margin-left: calc(var(--design-unit) * 1px);
        margin-right: calc(var(--design-unit) * 1px);
    }

    #dropdown {
        height: 100%;
        display: none;
    }

    #searchcontrol {
        padding: calc(var(--base-height-multiplier) * 1px);
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        border-bottom: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        background-color: var(--neutral-layer-2);
    }

    #button-update-entries.updating svg {
        animation: spinning 1.5s linear infinite;
    }

    @keyframes spinning {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    #entries {
        height: 320px;
        padding: 0;
        margin: 0;
    }

    /*
    #entries .entry {
        height: 42px;
        padding: calc(var(--design-unit) * 1px);
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        gap: calc(var(--design-unit) * 1px);
        display: grid;
        grid-template-rows: min-content 1fr;
        grid-template-columns: min-content 1fr;
    }

    #entries .entry > div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    #entries .entry > .title {
        font-weight: bold;
    }

    #entries .entry:hover {
        cursor: pointer;
        background-color: var(--neutral-fill-hover);
    }

    .icon {
        margin-right: calc(var(--design-unit) * 1px);
        height: inherit;
        grid-row: 1 / -1;
    }
    */

    .hint {
        color: var(--neutral-foreground-hint);
    }
`;

const unstarred: ViewTemplate<WebsiteSelect> = html`
    <fluent-button id="add-favorite-button" appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_WebsiteSelect_AddFavoriteButton_Description()}" ?disabled=${model => !model.selected} :innerHTML=${() => IconAddFavorite} @click=${(model, ctx) => model.AddFavorite(ctx.event)}></fluent-button>
`;

const starred: ViewTemplate<WebsiteSelect> = html`
    <fluent-button id="remove-favorite-button" appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_WebsiteSelect_RemoveFavoriteButton_Description()}" ?disabled=${model => !model.selected} :innerHTML=${() => IconRemoveFavorite} @click=${(model, ctx) => model.RemoveFavorite(ctx.event)}></fluent-button>
`;

// HACK: LazyScroll is a quick and dirty implementation, so the provided `ctx` is not correctly passed through
//       => classes are not working, apply inline styles
//       => manually query correct host and provide callback function
const listitem: ViewTemplate<IMediaContainer> = html`
    <div class="entry" style="${styleEntries}" onmouseover="this.style.backgroundColor = getComputedStyle(this).getPropertyValue('--neutral-fill-hover')" onmouseout="this.style.backgroundColor = ''" @click=${(model, ctx) => ctx.parent.parentNode.parentNode.host.SelectEntry(model) }>
        <img class="icon" style="${styleIcon}" src="${model => model.Icon}"></img>
        <div class="title" style="${styleTitle}">${model => model.Title}</div>
        <div class="hint" style="${styleHint}">${model => model.Identifier}</div>
    </div>
`;

const template: ViewTemplate<WebsiteSelect> = html`
    <div id="heading" title="${() => S.Locale.Frontend_FluentCore_WebsiteSelect_Description()}" @click=${model => model.expanded = !model.expanded}>
        <img id="logo" src="${model => model.selected?.Icon}"></img>
        <div id="title">${model => model.selected?.Title ?? '…'}</div>
        <div id="controls">
        <div class="hint">${model => (model.filtered?.length ?? '') + '／' + (model.entries?.length ?? '')}</div>
            ${model => model.favorite ? starred : unstarred}
            <fluent-button id="button-settings" appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_WebsiteSelect_OpenSettingsButton_Description()}" ?disabled=${model => !model.selected} :innerHTML=${() => IconSettings} @click="${(model, ctx) => model.OpenSettings(ctx.event)}"></fluent-button>
        </div>
    </div>
    <div id="dropdown" ${ref('dropdown')}>
        <div id="searchcontrol">
            <fluent-searchbox placeholder="${() => S.Locale.Frontend_FluentCore_WebsiteSelect_SearchBox_Placeholder()}" @predicate=${(model, ctx) => model.match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
        </div>
        <fluent-lazy-scroll id="entries" :items=${model => model.filtered} :template=${listitem}></fluent-lazy-scroll>
    </div>
`;

@customElement({ name: 'fluent-website-select', template, styles })
export class WebsiteSelect extends FASTElement {

    dropdown: HTMLDivElement;

    @observable entries: IMediaContainer[] = [];
    entriesChanged() {
        this.FilterEntries();
    }
    @observable match: (text: string) => boolean = () => true;
    matchChanged() {
        this.FilterEntries();
    }
    @observable filtered: IMediaContainer[] = [];
    @observable selected: IMediaContainer;
    selectedChanged(previous: IMediaContainer, current: IMediaContainer) {
        if((current || previous) && !current?.IsSameAs(previous)) {
            this.$emit('selectedChanged', this.selected);
        }
    }
    @observable expanded = false;
    expandedChanged() {
        if(this.dropdown) {
            this.dropdown.style.display = this.expanded ? 'block' : 'none';
        }
    }
    @observable updating = false;
    @observable favorite = false;

    public async FilterEntries() {
        this.filtered = this.entries.filter(entry => this.match(entry.Title));
    }

    public SelectEntry(entry: IMediaContainer) {
        this.selected = entry;
        this.expanded = false;
        Observable.notify(this, 'expanded'); // force update of UI even when property not changed
    }

    public AddFavorite(event: Event) {
        event.stopPropagation();
        this.favorite = true;
        console.log('Added Favorite', this.selected?.Identifier);
    }

    public RemoveFavorite(event: Event) {
        event.stopPropagation();
        this.favorite = false;
        console.log('Removed Favorite', this.selected?.Identifier);
    }

    public OpenSettings(event: Event) {
        event.stopPropagation();
        if(this.selected?.Settings) {
            S.ShowSettingsDialog(...this.selected.Settings);
        }
    }
}