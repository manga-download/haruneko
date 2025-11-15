import { Tags } from '../Tags';
import icon from './ManganeloInfo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+$/, 'section div.flex div.grow h1')
@Common.MangasMultiPageCSS('div.grid h3.truncate a', Common.PatternLinkGenerator('/genre?page={page}'))
@Common.ChaptersSinglePageCSS('section#chapter-list table tbody tr a')
@Common.PagesSinglePageCSS('img[fetchpriority]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manganeloinfo', 'MangaNeloInfo', 'https://manganelo.info', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}