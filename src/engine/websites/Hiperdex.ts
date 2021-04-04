import { MangaScraper, MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import { FetchMangasMultiPageAJAX, FetchChaptersSinglePageAJAX, FetchPagesSinglePageHTML } from './decorators/WordPressMadara';

// TODO: Use decorators instead of method call forwarding ...
//@MangasMultiPageHTML()
//@ChaptersSinglePageHTML()
//@PagesSinglePageHTML()
export default class extends MangaScraper {

    public constructor() {
        super('hiperdex', 'Hiperdex', 'https://hiperdex.com');
    }

    /*
    // [ 'hentai', 'webtoon', 'english' ]
    public const Tags = [
        new Tag(Tags.Media, [ Media.Manga, Media.Manhua, Media.Novel ])
    ];
    */

    public FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return FetchMangasMultiPageAJAX.call(this, provider);
    }

    public FetchChapters(manga: Manga): Promise<Chapter[]> {
        return FetchChaptersSinglePageAJAX.call(this, manga);
    }

    public FetchPages(chapter: Chapter): Promise<Page[]> {
        return FetchPagesSinglePageHTML.call(this, chapter);
    }
}