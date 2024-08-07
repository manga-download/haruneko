import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, when, repeat } from '@microsoft/fast-element';
import type { MediaContainer, MediaItem } from '../../../engine/providers/MediaPlugin';
import { Chapter } from '../../../engine/providers/MangaPlugin';
import S from '../services/StateService';

import IconClose from '@fluentui/svg-icons/icons/dismiss_20_regular.svg?raw';

const styles: ElementStyles = css`

    :host {
        display: flex;
        flex-direction: column;
    }

    #heading {
        background-color: var(--neutral-layer-1);
        padding: calc(var(--design-unit) * 1px);
        gap: calc(var(--base-height-multiplier) * 1px);
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

const templatePage: ViewTemplate<MediaItem> = html`<fluent-media-item-page :Item=${model => model}></fluent-media-item-page>`;
const templateChapter: ViewTemplate<MediaItemPreview> = html`${repeat(model => model.items, templatePage, { recycle: false })}`;

const template: ViewTemplate<MediaItemPreview> = html`
    <div id="heading">
        <fluent-button appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_Preview_CloseButton_Description()}" :innerHTML=${() => IconClose} @click=${model => model.Entry = undefined}></fluent-button>
        <div id="caption">${model => model.Entry?.Title ?? ''}</div>
        <div></div>
    </div>
    <div id="content">
        ${when(model => model.Entry instanceof Chapter, templateChapter)}
    </div>
`;

@customElement({ name: 'fluent-media-item-preview', template, styles })
export class MediaItemPreview extends FASTElement {

    @observable Entry: MediaContainer<MediaItem>;
    async EntryChanged() {
        if(this.Entry?.Entries?.Value.length === 0) {
            this.items = [];
            await this.Entry?.Update();
        }
        this.items = this.Entry?.Entries.Value ?? [];
        this.$emit('entryChanged', this.Entry);
    }
    @observable items: MediaItem[];
}