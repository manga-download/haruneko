import { Tags } from '../Tags';
import icon from './KLManga.webp';
import { RandomText } from '../Random';
import { DecoratableMangaScraper, type Manga, type Chapter, type Page } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(FlatManga.pathManga, FlatManga.queryMangaTitle)
@Common.MangasSinglePageCSS(FlatManga.pathMangasSinglePage, 'span[data-toggle="mangapop"] a')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('klmanga', 'KLManga', 'https://klz9.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return FlatManga.FetchChaptersAJAX.call(this, manga, `/${RandomText(25)}.lstc?slug={manga}`, 'table td a.chapter');
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        return FlatManga.FetchPagesAJAX.call(
            this,
            chapter,
            /load_image\s*\(\s*(\d+)\s*,\s*'list-imga'\s*\)/g,
            `/${RandomText(30)}.iog?cid={chapter}`,
            'img.chapter-img:not([src*="olimposcan"]):not([src$=".gif"])',
            img => img.src);
    }
}

/*
type APIChapters = {
    id: string,
    chapter: string,
    name: string,
}[];

@Common.MangaCSS(/^{origin}\/[^/]+\.html$/, queryMangaTitle)
@Common.MangasSinglePageCSS(pathMangasSinglePage, 'span[data-toggle="mangapop"] a')
@Common.PagesSinglePageCSS('img.chapter-img:not([src*="olimposcan"]):not([src$=".gif"])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('klmanga', 'KLManga', 'https://klz9.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(`/${RandomString(20)}.lst?manga=` + ExtractMangaSlug(manga), this.URI);
        const chapters = await FetchJSON<APIChapters>(new Request(uri));
        return chapters.map(chapter => {
            const title = [ 'Chapter ' + chapter.chapter, chapter.name ].filter(segment => segment).join(' - ').trim();
            return new Chapter(this, manga, `/${RandomString(30)}.iog?cid=${chapter.id}`, title);
        });
    }
}
*/