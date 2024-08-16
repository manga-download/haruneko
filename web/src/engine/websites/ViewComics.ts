import { Tags } from '../Tags';
import icon from './ViewComics.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname + '/full',
        title: anchor.text.trim()
    };
}

@Common.MangaCSS(/^{origin}\/comic\/[^/]+$/, 'h1.title')
@Common.MangasMultiPageCSS('/comic-list?page={page}', 'ul.line-list > li > a')
@Common.ChaptersSinglePageCSS('ul.basic-list > li > a', ChapterExtractor)
@Common.PagesSinglePageCSS('div.chapter-container > img')
@Common.ImageElement(false)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('viewcomics', 'ViewComics', 'https://azcomix.me', Tags.Media.Comic, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}