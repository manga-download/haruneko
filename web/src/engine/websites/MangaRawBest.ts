import { Tags } from '../Tags';
import icon from './MangaRawBest.webp';
import * as Common from './decorators/Common';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';

@Common.MangaCSS(/^{origin}\/raw\/[^/]+$/, 'meta[property="og:title"]')
@Common.MangasMultiPageCSS('div.manga-vertical a[title]', Common.PatternLinkGenerator('/manga-list?page={page}'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div#chapterList ul a', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector<HTMLSpanElement>('span').textContent.trim()
}))
@Common.PagesSinglePageCSS('main div.text-center img[alt*=" - Page"]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangarawbest', 'MangaRaw(.best)', 'https://mangaraw.best', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}