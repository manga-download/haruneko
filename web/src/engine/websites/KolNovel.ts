import { Tags } from '../Tags';
import icon from './KolNovel.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

// TODO: Need novel support

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div#content div.soralist ul li a.series', '/series/list-mode/')
@MangaStream.ChaptersSinglePageCSS('div.eplister ul li a', 'div:not(.epl-date)')
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kolnovel', 'Kol Novel (ملوك الروايات)', 'https://kolnovel.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Novel, Tags.Language.Arabic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}