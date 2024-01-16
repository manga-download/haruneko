import { Tags } from '../Tags';
import icon from './Shqqaa.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaInfoExtractor(element: HTMLTitleElement) {
    return element.text.split('|')[0].replace('مانجا', '').trim();
}

@Common.MangaCSS(/^{origin}\/manga\//, 'head title', MangaInfoExtractor)
@Common.MangasSinglePageCSS('/manga/', 'div.card div.card-body h6.card-title a')
@Common.ChaptersSinglePageCSS('div.card.card-body div.text-center a[role="button"]')
@Common.PagesSinglePageCSS('div.img-manga img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shqqaa', `موقع شقاع (Shqqaa)`, 'https://www.shqqaa.com', Tags.Language.Arabic, Tags.Source.Scanlator, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}