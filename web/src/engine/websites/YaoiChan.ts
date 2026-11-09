import { Tags } from '../Tags';
import icon from './YaoiChan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/\S+\.html$/, 'div#info_wrap div.name_row h1 a.title_top_a')
@Common.MangasMultiPageCSS('div#content div.content_row div.manga_row1 h2 a.title_link', Common.PatternLinkGenerator('/catalog?offset={page}', 0, 20), 0)
@Common.ChaptersSinglePageCSS('table.table_cha tr td div.manga a')
@Common.PagesSinglePageJS('fullimg', 500)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('yaoichan', `Яой-тян (Yaoi-chan)`, 'https://v1.yaoi-chan.me', Tags.Language.Russian, Tags.Source.Aggregator, Tags.Media.Manga, Tags.Rating.Pornographic);
    }
    public override get Icon() {
        return icon;
    }
}