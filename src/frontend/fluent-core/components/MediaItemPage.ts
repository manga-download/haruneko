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

    .preview .info fluent-anchor::part(control) {
        text-decoration: none;
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
        <div class="info"><fluent-anchor appearance="hypertext" target="_blank" href="${model => model.item['Link']}" title="${model => model.item['Link']}">${model => model.info ?? '┄'}</fluent-anchor></div>
        ${when(model => model.img, html`<fluent-anchor appearance="hypertext" target="_blank" href="${model => model.img}" title="${model => model.img}"><img src="${model => model.img}" /></fluent-anchor>`)}
        ${when(model => !model.img, html`<fluent-progress-ring></fluent-progress-ring>`)}
    </div>
`;

@customElement({ name: 'fluent-media-item-page', template, styles })
export class MediaItemPage extends FASTElement {

    // TODO: When connecting the same page again that was previously aborted, it won't load

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.abort();
    }

    private abort = noop;
    @observable item: IMediaItem;
    itemChanged() {
        this.abort();
        if(this.item) {
            this.LoadPage();
        }
    }
    @observable img: string = undefined;
    imgChanged(oldValue: string, newValue: string) {
        if(oldValue?.startsWith('blob:')) {
            URL.revokeObjectURL(oldValue);
        }
        if(!newValue?.startsWith('blob:')) {
            this.info = undefined;
        }
    }
    @observable info: string = undefined;

    private async LoadPage() {
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
            this.img = URL.createObjectURL(data);
            this.info = `${data.type} @ ${data.size.toLocaleString('en-US', { useGrouping: true })}`;
        } catch(error) {
            console.warn(error);
        } finally {
            this.abort = noop;
        }
    }
}