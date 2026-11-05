import { Tags } from '../Tags';
import icon from './ManhwaIndo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/series\/[^/]+\/$/, 'main img[alt].rounded-lg', (img, uri) => ({
    id: uri.pathname,
    title: img.alt.trim()
}))
@Common.MangasMultiPageCSS('a.series', Common.PatternLinkGenerator('/explore/page/{page}/'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageJS(`
    new Promise( resolve => {
	    const chapters = JSON.parse(JSON.stringify(Alpine.$data(document.querySelector('[x-data*="chapterListData"]')).chapters));
	    resolve (chapters.map(({ url, chapter}) => ({ id: new URL(url).pathname, title: 'Chapter ' +chapter})) );
    })
`, 1500)
@Common.PagesSinglePageCSS('div.reader-area p img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwaindo', 'ManhwaIndo', 'https://www.manhwaindo.my', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}