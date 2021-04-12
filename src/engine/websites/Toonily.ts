import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import { MangasMultiPageCSS, ChaptersSinglePageCSS, PagesSinglePageCSS } from './decorators/WordPressMadara';

@MangasMultiPageCSS()
@ChaptersSinglePageCSS()
@PagesSinglePageCSS()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonily', 'Toonily', 'https://toonily.com');
    }

    /*
    // [ 'webtoon', 'hentai', 'english' ]
    public const Tags = [
        new Tag(Tags.Media, [ Media.Manga, Media.Manhua, Media.Novel ])
    ];
    */
}