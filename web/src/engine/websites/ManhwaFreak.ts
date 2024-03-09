import { Tags } from '../Tags';
import icon from './ManhwaFreak.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('div.chapter-info > p').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'section.series h1.title')
@Common.MangasSinglePageCSS('/manga/', 'div.lastest-serie > a', Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div.chapter-li > a', ChapterExtractor)
@MangaStream.PagesSinglePageJS([/ajax-loader/, /100\.5.gif$/ ])
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwafreak', 'ManhwaFreak', 'https://freakcomic.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}