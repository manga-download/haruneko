import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable } from '@microsoft/fast-element';
import type { IDownloadTask, Status } from '../../../engine/DownloadTask';

const styles: ElementStyles = css`

    :host {
        display: block;
        padding: calc(var(--design-unit) * 1px);
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
    }

    .mediatitle {
        font-weight: bold;
    }

    .mediatitle, .mediaitem {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .controls {
        gap: calc(var(--design-unit) * 1px);
        display: grid;
        align-items: center;
        grid-template-columns: min-content  minmax(0, 1fr) min-content;
        white-space: nowrap;
    }
`;

const template: ViewTemplate<DownloadManagerTask> = html`
    <div class="mediatitle">${model => model.entry?.Media.Parent.Title}</div>
    <div class="mediaitem">${model => model.entry?.Media.Title}</div>
    <div class="controls">
        <div>${model => model.status}</div>
        <fluent-progress min="0" max="1" :paused=${() => false} :value=${model => model.progress}></fluent-progress>
        <div>[ X ]</div>
    </div>
`;

@customElement({ name: 'fluent-download-manager-task', template, styles })
export class DownloadManagerTask extends FASTElement {

    override connectedCallback(): void {
        super.connectedCallback();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.entry?.StatusChanged.Unsubscribe(this.UpdateStatus);
        this.entry?.ProgressChanged.Unsubscribe(this.UpdateProgress);
    }

    @observable entry: IDownloadTask;
    entryChanged(oldValue: IDownloadTask, newValue: IDownloadTask) {
        oldValue?.StatusChanged.Unsubscribe(this.UpdateStatus);
        newValue?.StatusChanged.Subscribe(this.UpdateStatus);
        oldValue?.ProgressChanged.Unsubscribe(this.UpdateProgress);
        newValue?.ProgressChanged.Subscribe(this.UpdateProgress);

        this.UpdateStatus(null, this.entry?.Status);
        this.UpdateProgress(null, this.entry?.Progress);
    }
    @observable status: Status;
    @observable progress = 0;

    private UpdateStatus = function (_, value?: Status) {
        this.status = value;
    }.bind(this);

    private UpdateProgress = function (_, value?: number) {
        this.progress = value ?? 0;
    }.bind(this);
}