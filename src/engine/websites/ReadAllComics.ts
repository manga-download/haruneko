import { Tags } from '../Tags';
import icon from './ReadAllComics.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/category\/[^/]+\/$/, 'div.description-archive h1')
@Common.MangasSinglePageCSS('/?story=&s=&type=comic', 'ul.categories li a')
@Common.ChaptersSinglePageCSS('ul.list-story li a')
@Common.PagesSinglePageCSS('center div:not([id]) img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readallcomics', 'ReadAllComics', 'https://readallcomics.com', Tags.Media.Comic, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}