import { Tags } from '../Tags';
import icon from './ManHastro.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise(resolve => {
        resolve (imageLinks.map( image => atob(image)));
    });
`;

@Madara.MangaCSS(/^{origin}\/lermanga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.PagesSinglePageJS(pageScript)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhastro', 'ManHastro', 'https://manhastro.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}