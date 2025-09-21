import { Tags } from '../Tags';
import icon from './ZeurelScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname + anchor.search,
        title: anchor.text.trim()
    };
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname + anchor.search,
        title: anchor.querySelector('div.numCap').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/serie\.php\?serie=\d+$/, '.valore', undefined, true)
@Common.MangasSinglePagesCSS([ '/' ], 'div.dropdown-content a.titoliSerie', MangaExtractor)
@Common.ChaptersSinglePageCSS('.rigaCap a', undefined, ChapterExtractor)
@Common.PagesSinglePageCSS('.Immag img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('zeurelscan', 'ZeurelScan', 'https://www.zeurelscan.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Italian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}