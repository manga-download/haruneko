import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, when } from '@microsoft/fast-element';
import type { MediaItem } from '../../../engine/providers/MediaPlugin';
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
        <div class="info"><fluent-anchor appearance="hypertext" target="_blank" href="${model => model.Item?.['Link']}" title="${model => model.Item?.['Link']}">${model => model.info ?? '┄'}</fluent-anchor></div>
        ${when(model => model.Image, html`<fluent-anchor appearance="hypertext" target="_blank" href="${model => model.Image}" title="${model => model.Image}"><img src="${model => model.Image}" /></fluent-anchor>`)}
        ${when(model => !model.Image, html`<fluent-progress-ring></fluent-progress-ring>`)}
    </div>
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
            this.info = undefined;
        }
    }
    @observable info: string = undefined;

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
            this.info = `${data.type} @ ${data.size.toLocaleString('en-US', { useGrouping: true })}`;
        } catch(error) {
            console.warn(error);
        } finally {
            this.abort = noop;
        }
    }
}