import { Tags } from '../Tags';
import icon from './MangaRawBest.webp';
import * as Common from './decorators/Common';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLSpanElement>('span').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/raw\/[^/]+$/, 'meta[property="og:title"]')
@Common.MangasMultiPageCSS('/manga-list?page={page}', 'div.manga-vertical a[title]', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#chapterList ul a', ChapterExtractor)
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