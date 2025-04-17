import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, when } from '@microsoft/fast-element';
import type { MediaItem } from '../../../engine/providers/MediaPlugin';
import { Priority } from '../../../engine/taskpool/DeferredTask';

function noop() {/* ... */}

const styles: ElementStyles = css`

    :host {
        display: inline-block;
        margin: var(--spacingHorizontalS);
    }

    /* imitiate fluent-card as it is buggy ... */
    .preview {
        border: var(--strokeWidthThin) solid var(--neutral-stroke-layer-rest);
        border-radius: var(--borderRadiusXLarge);
        box-shadow: var(--shadow4);
    }

    .preview .info {
        padding: var(--spacingHorizontalXS);
        background-color: var(--colorNeutralBackground4);
        color: var(--colorNeutralForeground4);
    }

    fluent-image {
        display: inline-block;
        width: 320px;
        height: 320px;
    }

    .preview fluent-progress-ring {
        width: 64px;
        height: 64px;
        margin: 128px;
    }
`;

const templateImage: ViewTemplate<MediaItemPage> = html`
    <div class="info">
        <fluent-link target="_blank" href="${model => model.Item?.['Link']}" title="${model => model.Item?.['Link']}">
            <div>${model => model.info ?? '┄'}</div>
        </fluent-link>
    </div>
    <fluent-link appearance="subtle" target="_blank" href="${model => model.Image}" title="${model => model.Image}">
        <fluent-image fit="contain" shape="square">
            <img src="${model => model.Image}" />
        </fluent-image>
    </fluent-link>
`;

const templateSpinner: ViewTemplate<MediaItemPage> = html`
    <div class="info">┄</div>
    <fluent-spinner size="huge"></fluent-spinner>
`;

const template: ViewTemplate<MediaItemPage> = html`
    <div class="preview">
        ${when(model => model.Image, templateImage)}
        ${when(model => !model.Image, templateSpinner)}
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