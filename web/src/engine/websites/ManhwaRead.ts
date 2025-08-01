import { Tags } from '../Tags';
import icon from './ManhwaRead.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise ( resolve => {
        resolve( reader.parseData(chapterData.data).map( image => {
            return new URL(reader.base+ '/'+ image.src).href
        }));
    });
`;

@Common.MangaCSS(/^{origin}\/manhwa\/[^/]+\/$/, 'div.manga-titles h1')
@Common.MangasMultiPageCSS('/manhwa/page/{page}/', 'a.manga-item__link')
@Common.ChaptersSinglePageCSS('div#chaptersList a.chapter-item', Common.AnchorInfoExtractor(false, 'span.chapter-item__date'))
@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwaread', 'ManhwaRead', 'https://manhwaread.com', Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}