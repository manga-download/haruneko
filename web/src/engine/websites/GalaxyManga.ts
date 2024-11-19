import { Tags } from '../Tags';
import icon from './GalaxyManga.webp';
import { DecoratableMangaScraper, type MangaPlugin, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function ChapterInfoExtractor(element: HTMLAnchorElement) {
    return {
        id: element.pathname,
        title: element.querySelector<HTMLSpanElement>('div > div > span').innerText,
    };
}

@Common.ChaptersSinglePageCSS('main section div.overflow-y-auto div.grid > a', ChapterInfoExtractor)
@Common.PagesSinglePageCSS('main > section > div > img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private domainUpdated = false;
    private readonly mangapattern = /^{origin}\/series\/\d+-\d+-[^/]+$/;

    public constructor() {
        super('galaxymanga', 'Galaxy Manga', 'https://outdatedwebsite.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    private async DomainUpdate(): Promise<void> {
        if (this.domainUpdated) return;
        const [element] = await FetchCSS(new Request('https://gxcomic.xyz'), 'div.container p strong');
        this.URI.href = element ? element.textContent.startsWith('https://') ? element.textContent.trim() : `https://${element.textContent.trim()}` : this.URI.href;
        this.domainUpdated = true;
    }

    public override async Initialize(): Promise<void> {
        await this.DomainUpdate();
    }

    public override async ValidateMangaURL(url: string): Promise<boolean> {
        await this.DomainUpdate();
        const source = this.mangapattern.source.replaceAll('{origin}', this.URI.origin).replaceAll('{hostname}', this.URI.hostname);
        return new RegExpSafe(source, this.mangapattern.flags).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        return Common.FetchMangaCSS.call(this, provider, url, 'main section > div > div.font-semibold');
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (const category of [ 'manga', 'action', 'romance' ]) {
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, `/latest?main_genres=${category}&page={page}`, 'section.container div.grid div.flex > div.px-1 > a', 1);
            mangaList.push(...mangas);
        }
        return mangaList;
    }
}