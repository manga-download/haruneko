import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, when } from '@microsoft/fast-element';
import type { IMediaItem } from '../../../engine/providers/MediaPlugin';
import { Priority } from '../../../engine/taskpool/DeferredTask';

function noop() {/* ... */}

const styles: ElementStyles = css`

    :host {
        display: inline-block;
        margin: calc(var(--base-height-multiplier) * 1px);
    }

    /* imitiate fluent-card as it is buggy ... */
    .preview {
        border: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-layer-rest);
        border-radius: calc(var(--layer-corner-radius) * 1px);
        box-shadow: var(--elevation-shadow-card-rest);
    }

    .preview .info {
        padding: calc(var(--design-unit) * 1px);
        background-color: var(--neutral-layer-2);
        color: var(--neutral-foreground-hint);
    }

    .preview img {
        width: 320px;
        height: 320px;
        object-fit: contain;
    }

    .preview fluent-progress-ring {
        width: 64px;
        height: 64px;
        margin: 128px;
    }
`;

const template: ViewTemplate<MediaItemPage> = html`
    <div class="preview">
        <div class="info">${model => model.info ?? '┄'}</div>
        ${when(model => model.img, html`<img src="${model => model.img}" title="${model => model.item?.Link}" />`)}
        ${when(model => !model.img, html`<fluent-progress-ring></fluent-progress-ring>`)}
    </div>
`;

@customElement({ name: 'fluent-media-item-page', template, styles })
export class MediaItemPage extends FASTElement {

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.abort();
        this.revoke();
    }

    private abort = noop;
    private revoke = noop;
    @observable item: IMediaItem;
    itemChanged() {
        this.abort();
        this.revoke();
        if(this.item) {
            this.LoadPage();
        }
    }
    @observable img: string = undefined;
    @observable info: string = undefined;

    private async LoadPage() {
        this.info = undefined;
        this.img = undefined;
        try {
            const cancellator = new AbortController();
            this.abort = () => {
                this.abort = noop;
                cancellator.abort();
            };
            const data = await this.item.Fetch(Priority.High, cancellator.signal);
            this.abort = noop;
            if(!data || cancellator.signal.aborted) {
                return;
            }
            const url = URL.createObjectURL(data);
            this.revoke = () => {
                this.revoke = noop;
                URL.revokeObjectURL(url);
                this.img = undefined;
                this.info = undefined;
            };
            this.img = url;
            this.info = `${data.type} - ${data.size}`;
        } catch(error) {
            console.warn(error);
        } finally {
            this.abort = noop;
        }
    }
}