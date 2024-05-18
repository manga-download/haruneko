import { Tags } from '../Tags';
import icon from './RavenSeries.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaExtractor(element: HTMLElement): string {
    return element.textContent.split('|')[0].trim();
}

function ChapterExtractor(element: HTMLAnchorElement) {
    return {
        id: element.pathname,
        title: element.querySelector('div#name').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/sr2\/[^/]+$/, 'title', MangaExtractor)
@Common.MangasMultiPageCSS('/comics?page={page}', 'div#projectsDiv figure div a')
@Common.ChaptersSinglePageCSS('section#section-list-cap div.grid a.group', ChapterExtractor)
@Common.PagesSinglePageCSS('div.relative img.object-cover')
@Common.ImageAjax(true, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ravenseries', `RavenSeries`, 'https://ravensword.lat', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}