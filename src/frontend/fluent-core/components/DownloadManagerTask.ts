import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable } from '@microsoft/fast-element';
import { type IDownloadTask, Status } from '../../../engine/DownloadTask';
import S from '../services/StateService';

import IconQueued from '@fluentui/svg-icons/icons/clock_20_regular.svg?raw';
import IconPaused from '@fluentui/svg-icons/icons/pause_circle_20_regular.svg?raw'; // '@vscode/codicons/src/icons/debug-paused.svg?raw';
import IconDownloading from '@fluentui/svg-icons/icons/arrow_circle_down_20_regular.svg?raw'; // '@vscode/codicons/src/icons/arrow-circle-down.svg?raw';
import IconProcessing from '@fluentui/svg-icons/icons/arrow_sync_circle_20_regular.svg?raw'; // '@vscode/codicons/src/icons/arrow-circle-down.svg?raw';
import IconFailed from '@fluentui/svg-icons/icons/error_circle_20_regular.svg?raw'; // '@vscode/codicons/src/icons/error.svg?raw';
import IconCompleted from '@fluentui/svg-icons/icons/checkmark_circle_20_regular.svg?raw'; // '@vscode/codicons/src/icons/pass.svg?raw';
import IconRemove from '@fluentui/svg-icons/icons/dismiss_circle_20_regular.svg?raw'; // '@vscode/codicons/src/icons/trash.svg?raw';

const StatusIcons: Record<Status, string> = {
    [Status.Queued]: IconQueued,
    [Status.Paused]: IconPaused,
    [Status.Downloading]: IconDownloading,
    [Status.Processing]: IconProcessing,
    [Status.Failed]: IconFailed,
    [Status.Completed]: IconCompleted,
};

const styles: ElementStyles = css`

    :host {
        display: flex;
        flex-direction: column;
        gap: calc(var(--design-unit) * 1px);
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
        grid-template-columns:  minmax(0, 1fr) min-content min-content;
        white-space: nowrap;
    }

    .status {
        display: contents;
    }

    .status.${Status.Queued} svg {
        opacity: 0.5;
    }

    .status.${Status.Paused} svg {
    }

    .status.${Status.Downloading} svg {
    }

    .status.${Status.Processing} svg {
    }

    .status.${Status.Failed} svg {
        fill: #FF6060;
    }

    .status.${Status.Completed} svg {
        fill: #20C040;
    }
`;

const template: ViewTemplate<DownloadManagerTask> = html`
    <div class="mediatitle">${model => model.entry?.Media.Parent.Title}</div>
    <div class="mediaitem">${model => model.entry?.Media.Title}</div>
    <div class="controls">
        <fluent-progress min="0" max="1" :paused=${() => false} :value=${model => model.progress}></fluent-progress>
        <div class="status ${model => model.status}" :innerHTML=${model => StatusIcons[model.status]}></div>
        <fluent-button appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_DownloadManagerTask_RemoveButton_Description()}" @click=${model => HakuNeko.DownloadManager.Dequeue(model.entry)}>${IconRemove}</fluent-button>
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

    private UpdateStatus = function (_: IDownloadTask, value?: Status) {
        this.status = value;
    }.bind(this);

    private UpdateProgress = function (_: IDownloadTask, value?: number) {
        this.progress = value ?? 0;
    }.bind(this);
}