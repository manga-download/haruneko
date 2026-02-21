import { Tags } from '../Tags';
import icon from './MangaSect.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Liliana from './templates/Liliana';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'article header h1')
@Common.MangasMultiPageCSS('div.grid div.text-center > a', Liliana.MangasLinkGenerator)
@Common.ChaptersSinglePageCSS(Liliana.queryChapters)
@Liliana.PagesSinglePageJS()
@Common.ImageAjax(true, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasect', 'MangaSect', 'https://mangasect.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}