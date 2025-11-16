import { Tags } from '../Tags';
import icon from './Sany.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function PageExtractor(image: HTMLImageElement): string {
    return image.dataset.lazySrc ?? image.src;
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'h1.entry-title')
@Common.MangasSinglePageCSS('/manga/', 'div.animposx a', Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#chapter_list span.lchx a')
@Common.PagesSinglePageCSS('div.reader-area img#imagech[data-lazy-src]', PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sany', 'Sany', 'https://sanyteam.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Rating.Erotica, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}