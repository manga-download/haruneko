import { Tags } from '../Tags';
import icon from './TRWebtoon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/webtoon\/[^/]+$/, 'div#movie-card .movie__title')
@Common.MangasMultiPageCSS('div.page-content div.card div.card-body div.table-responsive a.text-hover-primary', Common.PatternLinkGenerator('/webtoon-listesi?page={page}'), 0, Common.AnchorInfoExtractor(false, 'span, div'))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('table#chapters tbody tr td:first-of-type a', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.text.split('.Bölüm').at(0).trim()
}))
@Common.PagesSinglePageCSS('div#images img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('trwebtoon', 'TR Webtoon', 'https://trmanga.com', Tags.Language.Turkish, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}