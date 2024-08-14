import { FASTElement, type ViewTemplate, type ElementStyles, customElement, html, css, observable, repeat } from '@microsoft/fast-element';
import type { DownloadTask } from '../../../engine/DownloadTask';
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
        background-color: var(--neutral-layer-2);
    }

    #entries {
        overflow-y: scroll;
        overflow-x: hidden;
    }
`;

const listitem: ViewTemplate<DownloadTask> = html`
    <fluent-download-manager-task :Entry=${model => model}></fluent-download-manager-task>
`;

const template: ViewTemplate<DownloadManager> = html`
    <div id="header">
        <div id="title">${() => S.Locale.Frontend_FluentCore_DownloadManager_Heading()}</div>
        <div class="hint">${model => model.filtered?.length ?? '┄'}／${model => model.Entries?.length ?? '┄'}</div>
    </div>
    <div id="searchcontrol">
        <fluent-searchbox placeholder="" @predicate=${(model, ctx) => model.Match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
    </div>
    <div id="entries">
        ${repeat(model => model.filtered, listitem)}
    </div>
`;

@customElement({ name: 'fluent-download-manager', template, styles })
export class DownloadManager extends FASTElement {

    override connectedCallback(): void {
        super.connectedCallback();
        HakuNeko.DownloadManager.Queue.Subscribe(this.DownloadsChanged);
        this.DownloadsChanged();
    }

    override disconnectedCallback(): void {
        super.disconnectedCallback();
        HakuNeko.DownloadManager.Queue.Unsubscribe(this.DownloadsChanged);
    }

    @observable Entries: DownloadTask[] = [];
    EntriesChanged() {
        this.FilterEntries();
    }
    @observable Match: (text: string) => boolean = () => true;
    MatchChanged() {
        this.FilterEntries();
    }
    @observable filtered: DownloadTask[] = [];

    public FilterEntries() {
        this.filtered = this.Entries.filter(task => this.Match(task.Media.Title)).slice(0, 500); /* TODO: virtual scrolling */
    }

    private DownloadsChanged = async () => {
        this.Entries = HakuNeko.DownloadManager.Queue.Value.slice();
    };
}