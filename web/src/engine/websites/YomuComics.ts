import { Tags } from '../Tags';
import icon from './YomuComics.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowPreloadScript } from '../platform/FetchProvider';
import { RandomText } from '../Random';

type APIMangas = {
    garimpo: {
        slug: string;
        title: string;
    }[];
};

type JSONChapters = {
    id: string;
    title: string;
}[];

type APIPages = {
    chapter: {
        content: string[];
    };
};

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/obra\/[^/]+$/, 'main img.object-cover', (img, uri) => ({ id: uri.pathname.split('/').at(-1), title: img.alt.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://yomu.com.br/api/';

    public constructor() {
        super('yomucomics', 'Yomu Comics', 'https://yomu.com.br', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { garimpo } = await FetchJSON<APIMangas>(new Request(new URL('./library?page=1&limit=99999&sort=popular&type=all', this.apiURL)));
        return garimpo.map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const eventName = RandomText(Math.random() * 8 + 8);

        const chapters = await FetchWindowPreloadScript<JSONChapters>(new Request(new URL(`./obra/${manga.Identifier}`, this.URI)), `
            JSON.parse = new Proxy(JSON.parse, {
                apply(target, thisArg, args) {
                    const result = Reflect.apply(target, thisArg, args);
                    if (Array.isArray(result) && result.length > 0 && result[0].number && result[0].title) {
                        setInterval(() => window.dispatchEvent(new CustomEvent('${eventName}', { detail: result })), 250);
                    }
                    return result;
                }
            });
        `, `
            new Promise(resolve => {
                window.addEventListener('${eventName}', event => resolve(event.detail), { once: true });
            });
        `, 1500);

        return chapters.map(({ id, title }) => new Chapter(this, manga, id, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter: { content } } = await FetchJSON<APIPages>(new Request(new URL(`./chapters?id=${chapter.Identifier}`, this.apiURL)));
        return content.map(image => new Page(this, chapter, new URL(image, this.URI)));
    }
}