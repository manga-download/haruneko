import { MangaScraper, MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import { FetchMangasMultiPageHTML, FetchChaptersSinglePageHTML, FetchPagesSinglePageHTML } from './decorators/WordPressMadara';

// TODO: Use decorators instead of method call forwarding ...
//@MangasMultiPageHTML(undefined, '/page/{page}/')
//@ChaptersSinglePageHTML()
//@PagesSinglePageHTML()
export default class extends MangaScraper {

    public constructor() {
        super('toonily', 'Toonily', 'https://toonily.com');
    }

    /*
    // [ 'webtoon', 'hentai', 'english' ]
    public const Tags = [
        new Tag(Tags.Media, [ Media.Manga, Media.Manhua, Media.Novel ])
    ];
    */

    public FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return FetchMangasMultiPageHTML.call(this, provider, undefined, '/page/{page}/');
    }

    public FetchChapters(manga: Manga): Promise<Chapter[]> {
        return FetchChaptersSinglePageHTML.call(this, manga);
    }

    public FetchPages(chapter: Chapter): Promise<Page[]> {
        return FetchPagesSinglePageHTML.call(this, chapter);
    }
}