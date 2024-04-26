import { Tags } from '../Tags';
import icon from './ManhuaKo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaLabelExtractor(element: HTMLImageElement): string {
    return element.getAttribute('title').trim();
}

@Common.MangaCSS(/^{origin}\/(manga|manhua|manhwa)\/[^/]+$/, 'img#preview', MangaLabelExtractor)
@Common.MangasMultiPageCSS('/home/search/page/{page}', 'div.card-stacked div.card-content a.white-text' )
@Common.ChaptersSinglePageCSS('table.table-chapters tbody tr td a')
@Common.PagesSinglePageCSS('div#pantallaCompleta img.responsive-img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuako', 'ManhuaKo', 'https://manhuako.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}