import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import { MangasMultiPageCSS, ChaptersSinglePageAJAX, PagesSinglePageCSS } from './decorators/WordPressMadara';

@MangasMultiPageCSS(undefined, '/manga-list/page/{page}/')
@ChaptersSinglePageAJAX()
@PagesSinglePageCSS()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hiperdex', 'Hiperdex', 'https://hiperdex.com');
    }

    /*
    // [ 'hentai', 'webtoon', 'english' ]
    public const Tags = [
        new Tag(Tags.Media, [ Media.Manga, Media.Manhua, Media.Novel ])
    ];
    */
}