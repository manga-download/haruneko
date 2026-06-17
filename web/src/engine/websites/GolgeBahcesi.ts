import { Tags } from '../Tags';
import icon from './GolgeBahcesi.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIMangas = {
    data: {
        slug: string;
        title: string;
    }[];
};

type APIChapters = 	{
    id: string;
    number: number;
}[];

type APIPages = {
    pages: {
        url: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'article h1', (el, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: el.textContent.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.golgebahcesi.com/api/';

    public constructor() {
        super('golgebahcesi', 'Gölge Bahçesi', 'https://golgebahcesi.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./series?limit=999&page=${page}`, this.apiURL)));
                const mangas = data.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchJSON<APIChapters>(new Request(new URL(`./series/${manga.Identifier}/chapters`, this.apiURL)));
        return chapters.map(({ id, number }) => new Chapter(this, manga, id, `Bölüm ${number}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(`./chapters/${chapter.Identifier}`, this.apiURL)));
        return pages.map(({ url }) => new Page(this, chapter, new URL(url)));
    }
}