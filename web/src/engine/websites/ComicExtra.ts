import { Tags } from '../Tags';
import icon from './ComicExtra.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname + '/full',
        title: anchor.text.trim()
    };
}

@Common.MangaCSS(/^{origin}\/comic\/[^/]+$/, 'div.anime-top h1.title')
@Common.MangasMultiPageCSS('/comic-list?c=&page={page}', 'ul.line-list li a', 1, 1, 0)
@Common.ChaptersSinglePageCSS('ul.basic-list li a', ChapterExtractor)
@Common.PagesSinglePageCSS('div.chapter-container img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicextra', `ComicExtra`, 'https://azcomix.me', Tags.Language.English, Tags.Media.Comic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}