import { FASTElement, type ViewTemplate, type ElementStyles, html, css, observable, Observable, ref } from '@microsoft/fast-element';
import type { MediaContainer, MediaChild } from '../../../engine/providers/MediaPlugin';
import { LocalizationProviderRegistration, type ILocalizationProvider } from '../services/LocalizationProvider';
import { SettingsManagerRegistration, type ISettingsManager } from '../services/SettingsManager';
import type { SearchBox } from './SearchBox';

import IconSettings from '@fluentui/svg-icons/icons/settings_20_regular.svg?raw';
import IconBrowse from '@fluentui/svg-icons/icons/open_20_regular.svg?raw';
import IconAddFavorite from '@fluentui/svg-icons/icons/star_off_20_regular.svg?raw';
import IconRemoveFavorite from '@fluentui/svg-icons/icons/star_20_filled.svg?raw';

const styles: ElementStyles = css`

    :host {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: min-content minmax(0, 1fr);
    }

    #heading {
        background-color: var(--colorNeutralBackground4);
        padding: var(--spacingHorizontalXS);
        gap: var(--spacingHorizontalS);
        display: grid;
        align-items: center;
        grid-template-columns: max-content 1fr max-content;
    }

    #heading:hover {
        cursor: pointer;
        background-color: var(--colorNeutralBackground1Hover);
    }

    #heading #logo {
        height: var(--fontSizeBase600);
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
        margin-left: var(--spacingHorizontalXS);
        margin-right: var(--spacingHorizontalXS);
    }

    #dropdown {
        height: 100%;
        display: none;
    }

    #searchcontrol {
        padding: var(--spacingHorizontalS);
        border-top: var(--strokeWidthThin) solid var(--colorNeutralStrokeSubtle);
        border-bottom: var(--strokeWidthThin) solid var(--colorNeutralStrokeSubtle);
        background-color: var(--colorNeutralBackground4);
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

    .hint {
        color: var(--colorNeutralForeground4);
    }
`;

const unstarred: ViewTemplate<WebsiteSelect> = html`
    <fluent-button icon-only id="add-favorite-button" appearance="transparent" title="${model => model.Localization.Locale.Frontend_FluentCore_WebsiteSelect_AddFavoriteButton_Description()}" ?disabled=${model => !model.Selected} :innerHTML=${() => IconAddFavorite} @click=${(model, ctx) => model.AddFavorite(ctx.event)}></fluent-button>
`;

const starred: ViewTemplate<WebsiteSelect> = html`
    <fluent-button icon-only id="remove-favorite-button" appearance="transparent" title="${model => model.Localization.Locale.Frontend_FluentCore_WebsiteSelect_RemoveFavoriteButton_Description()}" ?disabled=${model => !model.Selected} :innerHTML=${() => IconRemoveFavorite} @click=${(model, ctx) => model.RemoveFavorite(ctx.event)}></fluent-button>
`;

// HACK: LazyScroll is a quick and dirty implementation, so the provided `ctx` is not correctly passed through
//       => CSS classes are not working, apply inline styles
//       => manually query correct host and provide callback function
function CreateItemTemplate<T extends MediaContainer<MediaChild>>(onSelectCallback: (entry: T) => void, canSelectCallback = (_entry: T) => true) {

    const styleEntry = [
        'height: 42px',
        'padding: var(--spacingHorizontalXS)',
        'border-top: var(--strokeWidthThin) solid var(--colorNeutralStrokeSubtle)',
        'gap: var(--spacingHorizontalXS)',
        'display: grid',
        'grid-template-rows: min-content 1fr',
        'grid-template-columns: min-content 1fr',
        // HACK: => hovered cursor
        'cursor: pointer',
    ].join(';');

    const styleEntryDisabled = [
        styleEntry,
        'opacity: 0.5',
    ].join(';');

    const styleEntryIcon = [
        'margin-right: var(--spacingHorizontalXS)',
        'height: inherit',
        'grid-row: 1 / -1',
    ].join(';');

    const styleTrim = [
        'overflow: hidden',
        'white-space: nowrap',
        'text-overflow: ellipsis',
    ].join(';');

    const styleEntryTitle = [
        styleTrim,
        'font-weight: bold',
    ].join(';');

    const styleEntryHint = [
        styleTrim,
        'color: var(--colorNeutralForeground4)',
    ].join(';');

    return html<T>`
        <div  style="${model => canSelectCallback(model) ? styleEntry : styleEntryDisabled}" onmouseover="this.style.backgroundColor = getComputedStyle(this).getPropertyValue('--colorNeutralBackground1Hover')" onmouseout="this.style.backgroundColor = ''" @click=${model => onSelectCallback(model)}>
            <img style="${styleEntryIcon}" src="${model => model.Icon}"></img>
            <div style="${styleEntryTitle}">${model => model.Title}</div>
            <div style="${styleEntryHint}">${model => model.Identifier}</div>
        </div>
    `;
}

const template = html<WebsiteSelect>`
    <div id="heading" title="${model => model.Localization.Locale.Frontend_FluentCore_WebsiteSelect_Description()}" @click=${model => model.Expanded = !model.Expanded}>
        <img id="logo" src="${model => model.Selected?.Icon}"></img>
        <div id="title">${model => model.Selected?.Title ?? '…'}</div>
        <div id="controls">
            <div class="hint">${model => (model.filtered?.length ?? '') + '／' + (model.Entries?.length ?? '')}</div>
            <fluent-button icon-only id="button-browse" appearance="transparent" title="${model => model.Selected?.URI?.href}" ?disabled=${model => !model.Selected?.URI} :innerHTML=${() => IconBrowse} @click="${(model, ctx) => model.OpenBrowser(ctx.event)}"></fluent-button>
            ${model => model.favorite ? starred : unstarred}
            <fluent-button icon-only id="button-settings" appearance="transparent" title="${model => model.Localization.Locale.Frontend_FluentCore_WebsiteSelect_OpenSettingsButton_Description()}" ?disabled=${model => !model.Selected} :innerHTML=${() => IconSettings} @click="${(model, ctx) => model.OpenSettings(ctx.event)}"></fluent-button>
        </div>
    </div>
    <div id="dropdown" ${ref('dropdown')}>
        <div id="searchcontrol">
            <fluent-searchbox id="searchbox" ${ref('searchbox')} placeholder="${model => model.Localization.Locale.Frontend_FluentCore_WebsiteSelect_SearchBox_Placeholder()}" @predicate=${(model, ctx) => model.Match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
        </div>
        <fluent-lazy-scroll id="entries" :Items=${model => model.filtered} :template=${model => CreateItemTemplate(model.SelectEntry.bind(model))}></fluent-lazy-scroll>
    </div>
`;

export class WebsiteSelect extends FASTElement {

    @LocalizationProviderRegistration Localization: ILocalizationProvider;
    @SettingsManagerRegistration SettingsManager: ISettingsManager;
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
        if ((current || previous) && !current?.IsSameAs(previous)) {
            this.$emit('selectedChanged', this.Selected);
        }
    }
    @observable Expanded = false;
    ExpandedChanged() {
        if (this.dropdown) {
            this.dropdown.style.display = this.Expanded ? 'block' : 'none';
            this.searchbox.Focus();
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
        if (this.Selected?.Settings) {
            this.SettingsManager.ShowSettingsDialog(...this.Selected.Settings);
        }
    }

    public OpenBrowser(event: Event) {
        event.stopPropagation();
        if (this.Selected?.URI) {
            window.open(this.Selected.URI);
        }
    }
}

WebsiteSelect.define({ name: 'fluent-website-select', template, styles });