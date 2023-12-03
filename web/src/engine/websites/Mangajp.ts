import { Tags } from '../Tags';
import icon from './Mangajp.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

function MangaExtractor(element: HTMLElement): string {
    return element.textContent.replace(/Raw$/i, '').trim();
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div#content div.postbody article h1', MangaExtractor)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangajp', '漫画RAW(mangajp)', 'https://mangajp.top', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}