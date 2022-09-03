import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat } from '@microsoft/fast-element';
import type { IDownloadTask } from '../../../engine/DownloadTask';
import S from '../services/StateService';

const styles: ElementStyles = css`

    :host {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: min-content min-content minmax(0, 1fr);
    }

    #header {
        padding: calc(var(--base-height-multiplier) * 1px);
        background-color: var(--neutral-layer-2);
        display: grid;
        align-items: center;
        grid-template-rows: auto;
        grid-template-columns: minmax(0, 1fr) max-content;
    }

    #title {
        text-transform: uppercase;
        font-weight: bold;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .hint {
        color: var(--neutral-foreground-hint);
    }

    #searchcontrol {
        padding: calc(var(--base-height-multiplier) * 1px);
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        border-bottom: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
    }

    #entries {
        overflow-y: scroll;
        overflow-x: hidden;
    }

    /*
    #entries fluent-download-manager-item {
        height: 24px;
        padding: calc(var(--design-unit) * 1px);
        border-top: calc(var(--stroke-width) * 1px) solid var(--neutral-stroke-divider-rest);
        gap: calc(var(--design-unit) * 1px);
        display: grid;
        align-items: center;
        grid-template-rows: min-content;
        grid-template-columns: min-content 1fr min-content;
    }

    ul#entries li > div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    ul#entries li .controls {
        display: flex;
    }

    ul#entries li:hover {
        background-color: var(--neutral-fill-hover);
    }

    .icon {
        margin-right: calc(var(--design-unit) * 1px);
        height: inherit;
    }
    */
`;

const listitem: ViewTemplate<IDownloadTask> = html`
    <fluent-download-manager-task :entry=${model => model}></fluent-download-manager-task>
`;

const template: ViewTemplate<DownloadManager> = html`
    <div id="header">
        <div id="title">${() => S.Locale.Frontend_FluentCore_Panel_DownloadManager_Heading()}</div>
        <div class="hint">${model => model.filtered?.length ?? '┄'}／${model => model.entries?.length ?? '┄'}</div>
    </div>
    <div id="searchcontrol">
        <fluent-searchbox placeholder="" @predicate=${(model, ctx) => model.match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
    </div>
    <div id="entries">
        ${repeat(model => model.filtered, listitem)}
    </div>
`;

@customElement({ name: 'fluent-download-manager', template, styles })
export class DownloadManager extends FASTElement {

    override connectedCallback(): void {
        super.connectedCallback();
        HakuNeko.DownloadManager.TasksAdded.Subscribe(this.DownloadsChanged);
        HakuNeko.DownloadManager.TasksRemoved.Subscribe(this.DownloadsChanged);
        this.DownloadsChanged();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        HakuNeko.DownloadManager.TasksAdded.Unsubscribe(this.DownloadsChanged);
        HakuNeko.DownloadManager.TasksRemoved.Unsubscribe(this.DownloadsChanged);
    }

    @observable entries: IDownloadTask[] = [];
    entriesChanged() {
        this.FilterEntries();
    }
    @observable match: (text: string) => boolean = () => true;
    matchChanged() {
        this.FilterEntries();
    }
    @observable filtered: IDownloadTask[] = [];

    public FilterEntries() {
        this.filtered = this.entries.filter(task => this.match(task.Media.Title)).slice(0, 250); /* TODO: virtual scrolling */
    }

    private DownloadsChanged = async function() {
        this.entries = (await HakuNeko.DownloadManager.GetTasks()).slice();
    }.bind(this);
}