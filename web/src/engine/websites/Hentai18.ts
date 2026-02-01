import { Tags } from '../Tags';
import icon from './Hentai18.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/read-hentai\/[^/]+$/, 'div.title_content h1')
@Common.MangasMultiPageCSS('div.list_wrap ul.normal h3.title a', Common.PatternLinkGenerator('/tag/hentai?page={page}'))
@Common.ChaptersSinglePageCSS('ul#chapter-list li a')
@Common.PagesSinglePageCSS('div.item-photo img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentai18', 'Hentai18', 'https://hentai18.net', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}