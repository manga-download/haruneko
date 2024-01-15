import { Tags } from '../Tags';
import icon from './Hentai2Read.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const scriptPages = `
    new Promise((resolve, reject) => {
        try {
            resolve(window.gData.images.map(page => 'https://static.hentaicdn.com/hentai' + page));
        } catch (error) {
            reject(error);
        }
    });
`;

@Common.MangaCSS(/^{origin}\//, 'h3.block-title a', Common.ElementLabelExtractor('small'))
@Common.MangasMultiPageCSS('/hentai-list/all/any/all/name-az/{page}', 'div.book-grid div.overlay div.overlay-title a')
@Common.ChaptersSinglePageCSS('ul.nav-chapters li div.media > a', Common.AnchorInfoExtractor(false, 'div'))
@Common.PagesSinglePageJS(scriptPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentai2read', `Hentai2R`, 'https://hentai2read.com', Tags.Language.English, Tags.Media.Manga, Tags.Rating.Erotica, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
