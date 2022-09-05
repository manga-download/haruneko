import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, ref } from '@microsoft/fast-element';
import type { IMediaItem } from '../../../engine/providers/MediaPlugin';
import { Priority } from '../../../engine/taskpool/DeferredTask';

const spinner = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii05NiAtOTYgMjU2IDI1NiIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSI+CjxnIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2U9IiMwMzZFQzkiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik02MCwzMiBDNjAsMTYsNDcuNDY0LDQsMzIsNFM0LDE2LDQsMzIiIC8+PGFuaW1hdGVUcmFuc2Zvcm0gdmFsdWVzPSIwLDMyLDMyOzM2MCwzMiwzMiIgYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIiB0eXBlPSJyb3RhdGUiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBkdXI9IjFzIiAvPjwvZz4KPC9zdmc+';

function noop() {/* ... */}

const styles: ElementStyles = css`

    :host {
        display: inline-block;
    }

    .preview {
        width: 320px;
        height: 320px;
        margin: calc(var(--base-height-multiplier) * 1px);
        display: flex;
        flex-direction: column;
        text-align: center;
    }

    .preview .info {
        flex: 0;
        padding: calc(var(--design-unit) * 1px);
        background-color: var(--neutral-layer-2);
        color: var(--neutral-foreground-hint);
    }

    .preview img {
        flex: 1;
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

const template: ViewTemplate<MediaItemPage> = html`
    <fluent-card class="preview">
        <div class="info">${model => model.info}</div>
        <img src="${model => model.img}" />
    </fluent-card>
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
    @observable img: string = spinner;
    @observable info = '┄';

    private async LoadPage() {
        this.info = '┄';
        this.img = spinner;
        try {
            const cancellator = new AbortController();
            this.abort = () => {
                this.abort = noop;
                cancellator.abort();
            };
            console.log('FETCH', this.item.Parent.Title, this.item['Link']['pathname']);
            const data = await this.item.Fetch(Priority.High, cancellator.signal);
            this.abort = noop;
            if(!data || cancellator.signal.aborted) {
                return;
            }
            const url = URL.createObjectURL(data);
            this.revoke = () => {
                this.revoke = noop;
                URL.revokeObjectURL(url);
                this.img = spinner;
                this.info = '┄';
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