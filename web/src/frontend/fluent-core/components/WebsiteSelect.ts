import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, Observable, ref } from '@microsoft/fast-element';
import type { MediaContainer, MediaChild } from '../../../engine/providers/MediaPlugin';
import type { SearchBox } from './SearchBox';
import S from '../services/StateService';

import IconSettings from '@fluentui/svg-icons/icons/settings_20_regular.svg?raw';
import IconBrowse from '@fluentui/svg-icons/icons/open_20_regular.svg?raw';
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
    <fluent-button id="add-favorite-button" appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_WebsiteSelect_AddFavoriteButton_Description()}" ?disabled=${model => !model.Selected} :innerHTML=${() => IconAddFavorite} @click=${(model, ctx) => model.AddFavorite(ctx.event)}></fluent-button>
`;

const starred: ViewTemplate<WebsiteSelect> = html`
    <fluent-button id="remove-favorite-button" appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_WebsiteSelect_RemoveFavoriteButton_Description()}" ?disabled=${model => !model.Selected} :innerHTML=${() => IconRemoveFavorite} @click=${(model, ctx) => model.RemoveFavorite(ctx.event)}></fluent-button>
`;

// HACK: LazyScroll is a quick and dirty implementation, so the provided `ctx` is not correctly passed through
//       => classes are not working, apply inline styles
//       => manually query correct host and provide callback function
const listitem: ViewTemplate<MediaContainer<MediaChild>> = html`
    <div class="entry" style="${styleEntries}" onmouseover="this.style.backgroundColor = getComputedStyle(this).getPropertyValue('--neutral-fill-hover')" onmouseout="this.style.backgroundColor = ''" @click=${(model, ctx) => ctx.parent.parentNode.parentNode.host.SelectEntry(model) }>
        <img class="icon" style="${styleIcon}" src="${model => model.Icon}"></img>
        <div class="title" style="${styleTitle}">${model => model.Title}</div>
        <div class="hint" style="${styleHint}">${model => model.Identifier}</div>
    </div>
`;

const template: ViewTemplate<WebsiteSelect> = html`
    <div id="heading" title="${() => S.Locale.Frontend_FluentCore_WebsiteSelect_Description()}" @click=${model => model.Expanded = !model.Expanded}>
        <img id="logo" src="${model => model.Selected?.Icon}"></img>
        <div id="title">${model => model.Selected?.Title ?? '…'}</div>
        <div id="controls">
            <div class="hint">${model => (model.filtered?.length ?? '') + '／' + (model.Entries?.length ?? '')}</div>
            <fluent-button id="button-browse" appearance="stealth" title="${model => model.Selected?.URI?.href}" ?disabled=${model => !model.Selected?.URI} :innerHTML=${() => IconBrowse} @click="${(model, ctx) => model.OpenBrowser(ctx.event)}"></fluent-button>
            ${model => model.favorite ? starred : unstarred}
            <fluent-button id="button-settings" appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_WebsiteSelect_OpenSettingsButton_Description()}" ?disabled=${model => !model.Selected} :innerHTML=${() => IconSettings} @click="${(model, ctx) => model.OpenSettings(ctx.event)}"></fluent-button>
        </div>
    </div>
    <div id="dropdown" ${ref('dropdown')}>
        <div id="searchcontrol">
            <fluent-searchbox id="searchbox" ${ref('searchbox')} placeholder="${() => S.Locale.Frontend_FluentCore_WebsiteSelect_SearchBox_Placeholder()}" @predicate=${(model, ctx) => model.Match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
        </div>
        <fluent-lazy-scroll id="entries" :Items=${model => model.filtered} :template=${listitem}></fluent-lazy-scroll>
    </div>
`;

@customElement({ name: 'fluent-website-select', template, styles })
export class WebsiteSelect extends FASTElement {

    readonly dropdown: HTMLDivElement;
    readonly searchbox: SearchBox;

    @observable Entries: MediaContainer<MediaChild>[] = [];
    EntriesChanged() {
        this.FilterEntries();
    }
    @observable Match: (text: string) => boolean = () => true;
    MatchChanged() {
        this.FilterEntries();
    }
    @observable filtered: MediaContainer<MediaChild>[] = [];
    @observable Selected: MediaContainer<MediaChild>;
    SelectedChanged(previous: MediaContainer<MediaChild>, current: MediaContainer<MediaChild>) {
        if((current || previous) && !current?.IsSameAs(previous)) {
            this.$emit('selectedChanged', this.Selected);
        }
    }
    @observable Expanded = false;
    ExpandedChanged() {
        if(this.dropdown) {
            this.dropdown.style.display = this.Expanded ? 'block' : 'none';
            this.searchbox.control.control.focus();
            //this.searchbox.control.select();
        }
    }
    @observable updating = false;
    @observable favorite = false;

    public async FilterEntries() {
        this.filtered = this.Entries.filter(entry => this.Match(entry.Title));
    }

    public SelectEntry(entry: MediaContainer<MediaChild>) {
        this.Selected = entry;
        this.Expanded = false;
        Observable.notify(this, 'expanded'); // force update of UI even when property not changed
    }

    public AddFavorite(event: Event) {
        event.stopPropagation();
        this.favorite = true;
        console.log('Added Favorite', this.Selected?.Identifier);
    }

    public RemoveFavorite(event: Event) {
        event.stopPropagation();
        this.favorite = false;
        console.log('Removed Favorite', this.Selected?.Identifier);
    }

    public OpenSettings(event: Event) {
        event.stopPropagation();
        if(this.Selected?.Settings) {
            S.ShowSettingsDialog(...this.Selected.Settings);
        }
    }

    public OpenBrowser(event: Event) {
        event.stopPropagation();
        if(this.Selected?.URI) {
            window.open(this.Selected.URI);
        }
    }
}