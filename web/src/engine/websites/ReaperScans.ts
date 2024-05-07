import { Tags } from '../Tags';
import icon from './ReaperScans.webp';
import { type MangaPlugin, DecoratableMangaScraper, type Manga, Chapter, type Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { Priority, TaskPool } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';
import { Numeric } from '../SettingsManager';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type LaravelLivewireMessage = {
    effects?: {
        html: string;
    };
    fingerprint: {
        name: string;
    };
    serverMemo: {
        data: {
            page: number;
            paginators: {
                page: number;
            }
        }
    }
    updates?: {
        type: string;
        payload: {
            id: string;
            method: string;
            params: Array<number|string>;
        }
    }[];
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly interactionTaskPool = new TaskPool(1, new RateLimit(15, 60));

    public constructor() {
        super('reaperscans', 'Reaper Scans', 'https://reaperscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
        this.Settings.throttle = new Numeric('throttle.interactive', R.Plugin_Settings_ThrottlingInteraction, R.Plugin_Settings_ThrottlingInteractionInfo, 15, 1, 60);
        (this.Settings.throttle as Numeric).Subscribe(value => this.interactionTaskPool.RateLimit = new RateLimit(value, 60));
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/comics/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        return this.interactionTaskPool.Add(async () => Common.FetchMangaCSS.call(this, provider, url, 'h1.text-xl'), Priority.Normal);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page += 1) {
            const mangas = await this.interactionTaskPool.Add(async () => Common.FetchMangasSinglePageCSS.call(this, provider, `/comics?page=${page}`, 'div.grid li a.text-sm'), Priority.Normal);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private ExtractChapters(manga: Manga, node: ParentNode): Chapter[] {
        const elements = [ ...node.querySelectorAll<HTMLAnchorElement>('ul li a') ];
        return elements.map(element => new Chapter(this, manga, element.pathname, element.querySelector('div.truncate p.truncate').textContent.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(manga.Identifier, this.URI);
        const [ data ] = await this.interactionTaskPool.Add(async () => FetchCSS<HTMLDivElement>(new Request(uri.href), 'main div[wire\\:id][wire\\:initial-data]'), Priority.Normal);
        const chapterList = this.ExtractChapters(manga, data);
        const body = JSON.parse(data.getAttribute('wire:initial-data')) as LaravelLivewireMessage;
        delete body.effects;
        for(let page = 2, run = true; run; page++) {
            const chapters = await this.interactionTaskPool.Add(async () => this.FetchChaptersFromPage(manga, page, body), Priority.Normal);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async FetchChaptersFromPage(manga: Manga, page: number, body: LaravelLivewireMessage): Promise<Chapter[]> {
        const uri = new URL(manga.Identifier, this.URI);
        uri.pathname = '/livewire/message/' + body.fingerprint.name;

        body.updates = [{
            type: 'callMethod',
            payload: {
                id: '00000',
                method: 'gotoPage',
                params: [ page, 'page' ]
            }
        }];

        const request = new Request(uri.href, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const message = await FetchJSON<LaravelLivewireMessage>(request);
        const dom = new DOMParser().parseFromString(message.effects.html, 'text/html');
        return this.ExtractChapters(manga, dom);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        return this.interactionTaskPool.Add(async () => Common.FetchPagesSinglePageCSS.call(this, chapter, 'main img.max-w-full'), Priority.Normal);
    }
}