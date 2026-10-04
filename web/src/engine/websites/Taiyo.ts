import { Tags } from '../Tags';
import icon from './Taiyo.webp';
import { FetchJSON, FetchNextJS } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIChapters = {
    result: {
        data: {
            json: {
                chapters: {
                    id: string;
                    number: number;
                    title: string;
                }[];
            };
        };
    };
}[];

type HydratedPages = {
    mediaChapter: {
        pages: {
            id: string;
            extension?: string;
        }[];
    };
};

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/media\/[^/]+$/, 'meta[property="og:title"]', (meta, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: meta.content.trim()
}))
@Common.MangasNotSupported()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://taiyo.moe/api/trpc/';

    public constructor() {
        super('taiyo', 'Taiyō', 'https://taiyo.moe', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        const uri = new URL('./chapters.getByMediaId?batch=1', this.apiURL);
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                uri.searchParams.set('input', JSON.stringify({ 0: { json: { mediaId: manga.Identifier, perPage: 50, page } } }));
                const [{ result: { data: { json: { chapters: entries } } } } ] = await FetchJSON<APIChapters>(new Request(uri));
                const chapters = entries.map(({ id, number, title }) => new Chapter(this, manga, id, ['Capítulo', number, title].joinTitleSegments()));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { mediaChapter: { pages } } = await FetchNextJS<HydratedPages>(new Request(new URL(`/chapter/${chapter.Identifier}/1`, this.URI)), data => 'mediaChapter' in data);
        return pages.map(({ id, extension }) => new Page(this, chapter, new URL(`/medias/${chapter.Parent.Identifier}/chapters/${chapter.Identifier}/${id}.${ extension || 'jpg' }`, 'https://cdn.taiyo.moe')));
    }
}