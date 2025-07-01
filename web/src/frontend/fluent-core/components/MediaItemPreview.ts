import { FASTElement, html, css, observable, when, repeat } from '@microsoft/fast-element';
import type { MediaContainer, MediaItem } from '../../../engine/providers/MediaPlugin';
import { Chapter } from '../../../engine/providers/MangaPlugin';
import { LocalizationProviderRegistration, type LocalizationProvider } from '../services/LocalizationProvider';

import IconClose from '@fluentui/svg-icons/icons/dismiss_20_regular.svg?raw';

const styles = css`

    :host {
        display: flex;
        flex-direction: column;
    }

    #heading {
        background-color: var(--colorNeutralBackground2);
        padding: var(--spacingHorizontalXS);
        gap: var(--spacingHorizontalS);
        display: grid;
        align-items: center;
        grid-template-columns: max-content 1fr max-content;
    }

    #caption {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    #content {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        text-align: center;
    }
`;

const templatePage = html<MediaItem> `<fluent-media-item-page :Item=${model => model}></fluent-media-item-page>`;
const templateChapter = html<MediaItemPreview>`${repeat(model => model.items, templatePage, { recycle: false })}`;

const template = html<MediaItemPreview>`
    <div id="heading">
        <fluent-button icon-only appearance="transparent" title="${model => model.Localization.Locale.Frontend_FluentCore_Preview_CloseButton_Description()}" :innerHTML=${() => IconClose} @click=${model => model.Entry = undefined}></fluent-button>
        <div id="caption">${model => model.Entry?.Title ?? ''}</div>
        <div></div>
    </div>
    <div id="content">
        ${when(model => model.Entry instanceof Chapter, templateChapter)}
    </div>
`;

export class MediaItemPreview extends FASTElement {

    @LocalizationProviderRegistration Localization: LocalizationProvider;

    @observable items: ReadonlyArray<MediaItem>;

    @observable Entry: MediaContainer<MediaItem>;
    async EntryChanged() {
        if (this.Entry?.Entries?.Value.length === 0) {
            this.items = [];
            await this.Entry?.Update();
        }
        this.items = this.Entry?.Entries.Value ?? [];
        this.$emit('entryChanged', this.Entry);
    }
}

MediaItemPreview.define({ name: 'fluent-media-item-preview', template, styles });