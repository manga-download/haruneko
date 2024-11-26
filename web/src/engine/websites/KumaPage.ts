import { Tags } from '../Tags';
import icon from './KumaPage.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

function ChapterExtractor(row: HTMLTableRowElement) {
    return {
        id: row.querySelector<HTMLAnchorElement>('a').pathname,
        title: row.querySelector<HTMLTableCellElement>('td:nth-of-type(2)').textContent.trim()
    };
}
function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.title.replace(/\s+Bahasa\s+Indonesia\s*$/i, '').trim()
    };
}

@Common.MangaCSS(/^{origin}\/read\/[^/]+$/, 'div.comic-details p', MangaStream.MangaLabelExtractor)
@Common.MangasMultiPageCSS('/daftar-komik?page={page}', 'div#daftar-komik a', 1, 1, 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('tbody#result-comic tr', ChapterExtractor)
@Common.PagesSinglePageCSS('div.content_place img[alt]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kumapage', 'KumaPage', 'https://kumapage.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}