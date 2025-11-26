import { Tags } from '../Tags';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import icon from './RoliaScan.webp';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.post-type-header-inner h1')
@Common.MangasMultiPageCSS('div.article-feed a:not(:has(img))', Common.PatternLinkGenerator('/manga/?_paged={page}'))
@Common.ChaptersMultiPageCSS('div#chapter-list a.seenchapter', Common.PatternLinkGenerator('{id}chapterlist/?chap_page={page}'))
@MangaStream.PagesSinglePageCSS([/warning-\d+\./, /x99-1\./, /join-us-discord\./], 'div.manga-child-the-content img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('roliascan', 'Rolia Scan', 'https://roliascan.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

}