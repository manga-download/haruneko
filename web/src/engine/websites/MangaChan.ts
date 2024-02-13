import { Tags } from '../Tags';
import icon from './MangaChan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\//, 'div#info_wrap div.name_row h1 a.title_top_a')
@Common.MangasMultiPageCSS('/catalog?offset={page}', 'div#content div.content_row div.manga_row1 h2 a.title_link', 0, 20, 0)
@Common.ChaptersSinglePageCSS('table.table_cha tr td div.manga2 a')
@Common.PagesSinglePageJS('fullimg', 500)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangachan', `Манга-тян (Manga-chan)`, 'https://manga-chan.me', Tags.Language.Russian, Tags.Source.Aggregator, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}