import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, when, repeat } from '@microsoft/fast-element';
import type { IMediaContainer, IMediaItem } from '../../../engine/providers/MediaPlugin';
import { Chapter } from '../../../engine/providers/MangaPlugin';
import S from '../services/StateService';

import IconClose from '@fluentui/svg-icons/icons/dismiss_20_regular.svg?raw';

const styles: ElementStyles = css`

    :host {
    }

    #heading {
        position: fixed;
        left: 0;
        right: 0;
        opacity: 0.0;
        background-color: var(--neutral-layer-1);
        padding: calc(var(--design-unit) * 1px);
        gap: calc(var(--base-height-multiplier) * 1px);
        display: grid;
        align-items: center;
        grid-template-columns: max-content 1fr max-content;
        z-index: 1;
    }

    #heading:hover {
        opacity: 0.95;
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

const templatePage: ViewTemplate<IMediaItem> = html`<fluent-media-item-page :item=${model => model}></fluent-media-item-page>`;
const templateChapter: ViewTemplate<MediaItemPreview> = html`${repeat(model => model.items, templatePage)}`;

const template: ViewTemplate<MediaItemPreview> = html`
    <div id="heading">
        <fluent-button appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_Preview_CloseButton_Description()}" @click=${model => model.ClosePreview()}>${IconClose}</fluent-button>
        <div id="caption">${model => model.entry?.Title ?? ''}</div>
        <div></div>
    </div>
    <div id="content">
        ${when(model => model.entry instanceof Chapter, templateChapter)}
    </div>
`;

@customElement({ name: 'fluent-media-item-preview', template, styles })
export class MediaItemPreview extends FASTElement {

    @observable entry: IMediaContainer;
    async entryChanged() {
        if(this.entry?.Entries?.length === 0) {
            await this.entry?.Update();
        }
        this.items = (this.entry?.Entries ?? []) as IMediaItem[];
    }
    @observable items: IMediaItem[];

    public async ClosePreview() {
        this.$emit('previewClosed');
    }
}