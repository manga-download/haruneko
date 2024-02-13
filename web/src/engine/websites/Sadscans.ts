import { Tags } from '../Tags';
import icon from './Sadscans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaInfoExtractor(element: HTMLDivElement) {
    const id = element.querySelector<HTMLAnchorElement>('a').pathname;
    const title = element.querySelector<HTMLHeadingElement>('h2').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/series\//, 'div.title h2')
@Common.MangasSinglePageCSS('/series', 'div.series-list', MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('div.chap-link div.link a', Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div.swiper-slide img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sadscans', `Sadscans`, 'https://sadscans.com', Tags.Language.Turkish, Tags.Source.Scanlator, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}
