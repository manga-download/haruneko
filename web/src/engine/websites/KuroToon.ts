import { Tags } from '../Tags';
import icon from './KuroToon.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import { FetchJSON, FetchRegex } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type APIChapters = {
    chapters: {
        id: string;
        title: string;
        slug: string;
        number: string;
    }[];
};

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/comic\/[^/]+\/?/, 'meta[property="og:title"]', (meta, uri) => ({
    id: uri.pathname.split('/').filter(Boolean).at(-1),
    title: meta.content.trim()
}))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.grid a.block', Common.PatternLinkGenerator('/search/?page={page}'), 0, anchor => ({
    id: anchor.pathname.split('/').filter(Boolean).at(-1),
    title: anchor.querySelector('img').alt.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/v1/`;

    public constructor() {
        super('kurotoon', 'KuroToon', 'https://kurotoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIChapters>(new Request(new URL(`./comics/${manga.Identifier}/chapters`, this.apiURL)));
        return chapters.map(({ slug, title, number }) => new Chapter(this, manga, `/read/${slug}/`, ['ตอนที่', Number(number), title].joinTitleSegments()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [data] = await FetchRegex(new Request(new URL(chapter.Identifier, this.URI)), /images:\s*(\[.*?\])/g);
        return (<string[]>JSON.parse(data)).map(page => new Page(this, chapter, new URL(page, this.URI)));
    }

}
