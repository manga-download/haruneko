import { Tags } from '../Tags';
import icon from './Manjanoon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScripts = `
    new Promise ( resolve => {
        const realUrl = document.documentElement.innerHTML.match(/realUrl\\s*=\\s*\`([^$]+)/)[1];
        resolve( [...document.querySelectorAll('.myImage')].map(image => new URL(image.getAttribute('uid'), realUrl).href));
    });
`;

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'div.grid div.grid h1')
@Common.MangasSinglePagesCSS(['/latest'], 'div.grid a.grid', Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#chapters a', Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageJS(pageScripts, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manjanoon', 'Manjanoon', 'https://manjanoon.art', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Arabic, Tags.Source.Scanlator);
    }
    public override get Icon() {
        return icon;
    }

}