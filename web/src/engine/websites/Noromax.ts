import { Tags } from '../Tags';
import icon from './Noromax.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

export function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.text.replace(/Bahasa Indonesia$/i, '')
    };
}

@MangaStream.MangaCSS(/^{origin}\/Komik\/[^/]+\/$/)
@Common.MangasSinglePageCSS('/Komik/list-mode/', 'div#content div.soralist ul li a.series', MangaExtractor)
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('noromax', 'Noromax', 'https://noromax.my.id', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}