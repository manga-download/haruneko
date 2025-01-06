import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

const DefaultChapterExtractor = Common.AnchorInfoExtractor(false, '.chapter-update');
const pageScript = `window.chapImages.split(',').map(image => window.mainServer ? window.mainServer + image : image);`;

@Common.MangaCSS(/^{origin}(\/manga)?\/[^/]+$/, 'div.name.box h1')
@Common.MangasMultiPageCSS('/az-list?page={page}', 'div.manga-list div.title h3 a')
@Common.ChaptersSinglePageCSS('ul.chapter-list li a', DefaultChapterExtractor)
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export class MadTheme extends DecoratableMangaScraper {}