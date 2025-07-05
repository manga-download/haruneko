import { FASTElement, html, css, observable, repeat } from '@microsoft/fast-element';
import type { DownloadTask } from '../../../engine/DownloadTask';
import { LocalizationProviderRegistration, type ILocalizationProvider } from '../services/LocalizationProvider';

const styles = css`

    :host {
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: min-content min-content minmax(0, 1fr);
    }

    #header {
        padding: var(--spacingHorizontalS);
        background-color: var(--colorNeutralBackground4);
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
        color: var(--colorNeutralForeground4);
    }

    #searchcontrol {
        padding: var(--spacingHorizontalS);
        border-top: var(--strokeWidthThin) solid var(--colorNeutralStrokeSubtle);
        border-bottom: var(--strokeWidthThin) solid var(--colorNeutralStrokeSubtle);
        background-color: var(--colorNeutralBackground4);
    }

    #entries {
        overflow-y: scroll;
        overflow-x: hidden;
    }
`;

function CreateItemTemplate(_container: DownloadManager) {
    return html<DownloadTask>`<fluent-download-manager-task :Entry=${model => model}></fluent-download-manager-task>`;
}

const template = html<DownloadManager>`
    <div id="header">
        <div id="title">${model => model.Localization.Locale.Frontend_FluentCore_DownloadManager_Heading()}</div>
        <div class="hint">${model => model.filtered?.length ?? '┄'}／${model => model.Entries?.length ?? '┄'}</div>
    </div>
    <div id="searchcontrol">
        <fluent-searchbox placeholder="" @predicate=${(model, ctx) => model.Match = (ctx.event as CustomEvent<(text: string) => boolean>).detail}></fluent-searchbox>
    </div>
    <div id="entries">
        ${repeat(model => model.filtered, CreateItemTemplate)}
    </div>
`;

export class DownloadManager extends FASTElement {

    @LocalizationProviderRegistration Localization: ILocalizationProvider;

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

DownloadManager.define({ name: 'fluent-download-manager', template, styles });