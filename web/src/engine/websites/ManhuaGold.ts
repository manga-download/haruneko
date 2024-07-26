import { Tags } from '../Tags';
import icon from './ManhuaGold.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Liliana from './templates/Liliana';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'article header h1')
@Common.MangasMultiPageCSS(Liliana.mangaPath, 'div.grid div.text-center a.clamp')
@Common.ChaptersSinglePageCSS(Liliana.queryChapters)
@Common.PagesSinglePageJS(Liliana.queryPagesScript, 500)
@Common.ImageElement(false, true, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuagold', 'Manhua Gold', 'https://manhuagold.top', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}