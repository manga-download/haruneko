import { Tags } from '../Tags';
import icon from './AssortedScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/reader\/[^/]+\/$/, '#series-title')
@Common.MangasSinglePageCSS('/reader/', 'section.series h2.series-title a')
@Common.ChaptersSinglePageCSS('div.chapter > a')
@Common.PagesSinglePageCSS<HTMLAnchorElement>('li.dropdown-element.page-details a', a => a.pathname)
@Common.ImageAjaxFromHTML('#page-image', false, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('assortedscans', `Assorted Scans`, 'https://assortedscans.com', Tags.Language.English, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}