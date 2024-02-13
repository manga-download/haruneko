import { Tags } from '../Tags';
import icon from './TRWebtoon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.text.split('.Bölüm')[0].trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/webtoon\//, 'div#movie-card h2.movie__title')
@Common.MangasMultiPageCSS('/webtoon-listesi?page={page}', 'div.page-content div.card div.card-body div.table-responsive a.text-hover-primary')
@Common.ChaptersSinglePageCSS('table#chapters tbody tr td:first-of-type a', ChapterExtractor)
@Common.PagesSinglePageCSS('div#images img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('trwebtoon', `TR Webtoon`, 'https://trwebtoon.com', Tags.Language.Turkish, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}