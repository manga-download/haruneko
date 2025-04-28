import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable } from '@microsoft/fast-element';
import type { MediaItem } from '../../../engine/providers/MediaPlugin';
import { Priority } from '../../../engine/taskpool/DeferredTask';

function noop() {/* ... */}

const styles: ElementStyles = css`

    :host {
        display: inline-grid;
        margin: var(--spacingHorizontalS);
        /* imitiate fluent-card as it is not yet implemented ... */
        border: var(--strokeWidthThin) solid var(--neutral-stroke-layer-rest);
        border-radius: var(--borderRadiusXLarge);
        box-shadow: var(--shadow4);
        overflow: clip;
    }

    a {
        color: var(--colorBrandForegroundLink);
        text-decoration: none;
    }

    .info {
        padding: var(--spacingHorizontalXS);
        background-color: var(--colorNeutralBackground4);
        color: var(--colorNeutralForeground4);
    }

    .thumbnail {
        width: 320px;
        height: 320px;
    }

    .link {
        display: block;
    }

    .spinner {
        display: grid;
        align-items: center;
        justify-items: center;
    }
`;

/* FIXME: Fluent-Link click will be fired twice
const templateInfo: ViewTemplate<MediaItemPage> = html`
    <fluent-link target="_blank" href="${model => model.Item?.['Link']}" title="${model => model.Item?.['Link']}">
        ${model => model.Info ?? '┄'}
    </fluent-link>
`;
*/

const templateInfo: ViewTemplate<MediaItemPage> = html`
    <a target="_blank" href="${model => model.Item?.['Link']}" title="${model => model.Item?.['Link']}">
        ${model => model.Info ?? '┄'}
    </a>
`;

const templateImage: ViewTemplate<MediaItemPage> = html`
    <a class="thumbnail link" target="_blank" href="${model => model.Image}" title="${model => model.Image}">
        <fluent-image fit="contain" shape="square">
            <img src="${model => model.Image}" />
        </fluent-image>
    </a>
`;

const templateSpinner: ViewTemplate<MediaItemPage> = html`
    <div class="thumbnail spinner">
        <fluent-spinner size="huge"></fluent-spinner>
    </div>
`;

const template: ViewTemplate<MediaItemPage> = html`
    <div class="info">
        ${model => model.Item && model.Info ? templateInfo : html`┄`}
    </div>
    ${model => model.Image ? templateImage : templateSpinner}
`;

@customElement({ name: 'fluent-media-item-page', template, styles })
export class MediaItemPage extends FASTElement {

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.Item = undefined;
    }

    private abort = noop;
    private timerLoadPage: number;
    @observable Item: MediaItem;
    ItemChanged() {
        this.abort();
        this.Image = undefined;
        // NOTE: Prevent too frequent changes, e.g. caused by recycling existing instances...
        window.clearTimeout(this.timerLoadPage);
        this.timerLoadPage = window.setTimeout(() => {
            if(this.Item) {
                window.clearTimeout(this.timerLoadPage);
                this.LoadPage();
            }
        }, 500);
    }
    @observable Image: string = undefined;
    ImageChanged(oldValue: string, newValue: string) {
        if(oldValue?.startsWith('blob:')) {
            URL.revokeObjectURL(oldValue);
        }
        if(!newValue?.startsWith('blob:')) {
            this.Info = undefined;
        }
    }
    @observable Info: string = undefined;

    private async LoadPage() {
        try {
            const cancellator = new AbortController();
            this.abort = () => {
                this.abort = noop;
                cancellator.abort();
            };
            const data = await this.Item.Fetch(Priority.High, cancellator.signal);
            this.abort = noop;
            if(!data || cancellator.signal.aborted) {
                return;
            }
            this.Image = URL.createObjectURL(data);
            this.Info = `${data.type} @ ${data.size.toLocaleString('en-US', { useGrouping: true })}`;
        } catch(error) {
            console.warn(error);
        } finally {
            this.abort = noop;
        }
    }
}