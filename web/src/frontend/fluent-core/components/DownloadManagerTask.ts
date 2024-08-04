import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable } from '@microsoft/fast-element';
import { type DownloadTask, Status } from '../../../engine/DownloadTask';
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
        cursor: pointer;
        fill: #FF6060;
    }

    .status.${Status.Completed} svg {
        fill: #20C040;
    }
`;

const template: ViewTemplate<DownloadManagerTask> = html`
    <div class="mediatitle">${model => model.Entry?.Media.Parent.Title}</div>
    <div class="mediaitem">${model => model.Entry?.Media.Title}</div>
    <div class="controls">
        <fluent-progress min="0" max="1" :paused=${() => false} :value=${model => model.progress}></fluent-progress>
        <div class="status ${model => model.status}" :innerHTML=${model => StatusIcons[model.status]} @click=${model => model.ShowErrors()}></div>
        <fluent-button appearance="stealth" title="${() => S.Locale.Frontend_FluentCore_DownloadManagerTask_RemoveButton_Description()}" :innerHTML=${() => IconRemove} @click=${model => HakuNeko.DownloadManager.Dequeue(model.Entry)}></fluent-button>
    </div>
`;

@customElement({ name: 'fluent-download-manager-task', template, styles })
export class DownloadManagerTask extends FASTElement {

    override connectedCallback(): void {
        super.connectedCallback();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        this.Entry?.Status.Unsubscribe(this.UpdateStatus);
        this.Entry?.Progress.Unsubscribe(this.UpdateProgress);
    }

    @observable Entry: DownloadTask;
    EntryChanged(oldValue: DownloadTask, newValue: DownloadTask) {
        oldValue?.Status.Unsubscribe(this.UpdateStatus);
        newValue?.Status.Subscribe(this.UpdateStatus);
        oldValue?.Progress.Unsubscribe(this.UpdateProgress);
        newValue?.Progress.Subscribe(this.UpdateProgress);

        this.UpdateStatus(this.Entry?.Status.Value);
        this.UpdateProgress(this.Entry?.Progress.Value);
    }
    @observable status: Status;
    @observable progress = 0;

    private UpdateStatus = function (this: DownloadManagerTask, value: Status) {
        this.status = value;
    }.bind(this);

    private UpdateProgress = function (this: DownloadManagerTask, value: number) {
        this.progress = value ?? 0;
    }.bind(this);

    public ShowErrors() {
        if(this.Entry.Errors.length > 0) {
            // TODO: Show all errors in a fancy error dialog ...
            const message = this.Entry.Errors.map(error => {
                return `<div>${error.message}</div><pre>${error.stack}</pre>`;
            }).join('<hr>');
            window.open(null, '_blank', [
                'titlebar=no',
                'menubar=no',
                'toolbar=no',
                'location=no',
                'status=no',
                'scrollbars=yes',
                'resizable=yes',
                'width=800',
                'height=480'
            ].join(', ')).document.write(message);
        }
    }
}