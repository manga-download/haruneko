import { Tags } from '../Tags';
import icon from './AlphaManga.webp';
import { Chapter, DecoratableMangaScraper, Page, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchHTML, FetchJSON } from '../platform/FetchProvider';
import * as AlphaViewer from './decorators/AlphaViewer';
import { AddAlphaAntiScraping, ExtractKeys, type PageData } from './decorators/AlphaViewer';
import { GetBase64FromBytes } from '../BufferEncoder';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type APIMangas = {
    data: {
        manga_sele_id: number;
        title: string;
    }[];
};

type APIChapters = {
    episodes: {
        episode_no: number;
        title: string;
    }[];
};

AddAlphaAntiScraping(/^https:\/\/(?:www\.)?alpha-manga\.com/);

@Common.MangaCSS(/^{origin}\/manga\/\d+$/, 'meta[property="og:title"]', (el, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: el.getAttribute('content').split('|').at(0).trim()
}))
@AlphaViewer.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('alphamanga', 'Alpha Manga', 'https://www.alpha-manga.com', Tags.Language.English, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./manga/search.json?page=${page}`, this.URI)));
                const mangas = data.map(({ manga_sele_id: id, title }) => new Manga(this, provider, `${id}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { episodes } = await FetchJSON<APIChapters>(new Request(new URL(`./manga/${manga.Identifier}/episodes.json`, this.URI)));
        return episodes.map(({ episode_no: num, title }) => new Chapter(this, manga, `${num}`, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const doc = await FetchHTML(new Request(new URL(`./manga/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI)));
        const viewer = doc.querySelector<HTMLElement>('viewer-manga-vertical, viewer-manga-horizontal');
        if (!viewer) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        };

        const pages = (<string[]>JSON.parse(viewer.getAttribute('v-bind:pages'))).filter(value => /^http/.test(value));
        const keys = ExtractKeys(viewer.getAttribute('placeholder'));
        return pages.map((url, index) => new Page(this, chapter, new URL(url), { key: GetBase64FromBytes(keys[index]) }));
    }
}