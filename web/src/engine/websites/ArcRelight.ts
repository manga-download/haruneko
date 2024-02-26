// Template: https://github.com/mangadventure/MangAdventure

import { Tags } from '../Tags';
import icon from './ArcRelight.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/reader\/[^/]+\/$/, '#series-title')
@Common.MangasSinglePageCSS('/reader/', 'section.series h2.series-title a')
@Common.ChaptersSinglePageCSS('div.chapter > a')
@Common.PagesSinglePageCSS<HTMLAnchorElement>('li.dropdown-element.page-details a', a => a.pathname)
@Common.ImageAjaxFromHTML('#page-image', false, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('arcrelight', 'Arc-Relight', 'https://arc-relight.com', Tags.Language.English, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}