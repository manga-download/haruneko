import { Tags } from '../Tags';
import icon from './TempleScan.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIMangas = {
    series_slug: string;
    title: string;
}[];

type APIChapters = {
    Season: {
        Chapter: {
            chapter_slug: string;
            chapter_name: string;
            chapter_title?: string;
        }[]
    }[]
};

type APIPages = {
    chapter_data: {
        images: (string | { url: string })[];
    }
};

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/comic\/[^/]+$/, 'head meta[property="og:title"]', (meta, uri) => ({ id: uri.pathname.split('/').at(-1), title: meta.content }))
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.templetoons.com/api/';

    public constructor() {
        super('templescan', 'TempleScan', 'https://templetoons.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const data = await FetchJSON<APIMangas>(new Request(new URL('./allComics', this.apiURL)));
        return data.map(({ series_slug: slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { Season } = await FetchJSON<APIChapters>(new Request(new URL(`./comic/${manga.Identifier}`, this.apiURL)));
        return !Season ? [] : Season.reduce<Chapter[]>((accumulator, season) => {
            const chapters = season.Chapter.map(({ chapter_title: title, chapter_slug: slug, chapter_name: name }) => {
                title = title ? [name, title].join(' : ') : name;
                return new Chapter(this, manga, slug, title);
            });
            return [...accumulator, ...chapters];
        }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter_data: { images } } = await FetchJSON<APIPages>(new Request(new URL(`./comic/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiURL)));
        return images.map(image => new Page(this, chapter, new URL((<any>image)?.url ?? image)));
    }
}