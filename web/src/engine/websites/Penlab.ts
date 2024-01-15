import { Tags } from '../Tags';
import icon from './Penlab.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

const scriptApiUrl = `
    new Promise((resolve, reject)=> {
        const collectionGetters = Object.values(wwLib.$store.getters['data/getCollections']);
        const goodgetter = collectionGetters.find(e => {
            return e.config.endpoint.path == '/comic';
        });
        resolve(goodgetter.config.apiGroupUrl);
   });
`;

const MangaIdScript = `
    new Promise((resolve, reject)=> {
        const curPage = wwLib.wwWebsiteData.getCurrentPage();
        resolve(
            {
                id: curPage.data.id, 
                title : curPage.data.title
            }
        );
    });
`;

type APIManga = {
    id: number,
    title: string,
    is_paid: boolean,
    is_locked: boolean,
    slug: string
}

type APIChapter = {
    id: number,
    episode_title: string,
    episode_number: string,
    is_accessible: boolean,
    require_login: boolean,
    canView: boolean,
    nonUserCanView: boolean
}

type APIPage = {
    id: number,
    ucarecdn_graphic_link: string
}

type MangaID = {
    id: number,
    title: string;
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private apiUrl = 'https://x5i7-qk19-xc7o.s2.xano.io/api:hI9i4Ljs';

    public constructor() {
        super('penlab', `Penlab`, 'http://www.penlab.ink', Tags.Language.English, Tags.Media.Comic, Tags.Source.Official);
    }

    public override async Initialize(): Promise<void> {
        try {
            const request = new Request(new URL('/genres', this.URI).href);
            this.apiUrl = await FetchWindowScript<string>(request, scriptApiUrl, 1000);
        } catch {
            //
        }
        return;
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/titles/\\S+/$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const request = new Request(url);
        const mangaId = await FetchWindowScript<MangaID>(request, MangaIdScript, 2000);
        return new Manga(this, provider, String(mangaId.id), mangaId.title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new Request(`${this.apiUrl}/comic`);
        const data = await FetchJSON<APIManga[]>(request);
        return data.map(manga => new Manga(this, provider, String(manga.id), manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(`${this.apiUrl}/chapter?comic_id=${manga.Identifier}`);
        const data = await FetchJSON<APIChapter[]>(request);
        return data.map(chap => new Chapter(this, manga, String(chap.id), chap.episode_title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(`${this.apiUrl}/episode?episode_id=${chapter.Identifier}`);
        const data = await FetchJSON<APIPage[]>(request);
        return data.map(page => new Page(this, chapter, new URL(page.ucarecdn_graphic_link)));
    }
}