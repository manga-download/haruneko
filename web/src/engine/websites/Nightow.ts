import { Tags } from '../Tags';
import icon from './Nightow.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function InfoExtractor(anchor: HTMLAnchorElement) {
    const id = '/online/'+anchor.search;
    const title = anchor.text.replace('[NightowScans]', '').trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}/, 'div.theList h3.title', Common.ElementLabelExtractor(), true)
@Common.MangasSinglePageCSS('', 'div.selector2 div.options a', InfoExtractor)
@Common.ChaptersSinglePageCSS('div.theList div.chapter b a', InfoExtractor)
@Common.PagesSinglePageJS('imageArray.map(image => window.location.origin +"/online/"+ image);', 1000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nightow', `Nightow`, 'http://nightow.net', Tags.Language.Spanish, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}