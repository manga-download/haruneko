import { Tags } from '../Tags';
import icon from './MangaSect.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Liliana from './templates/Liliana';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'article header h1')
@Common.MangasMultiPageCSS('/all-manga/{page}/', 'div.grid div.text-center > a')
@Common.ChaptersSinglePageCSS(Liliana.queryChapters)
@Common.PagesSinglePageJS(Liliana.queryPagesScript, 500)
@Common.ImageAjax(true, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasect', 'MangaSect', 'https://mangasect.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}