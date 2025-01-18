import { Tags } from '../Tags';
import icon from './ZinMangaNet.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.post-title h1')
@Madara.MangasMultiPageCSS()
@Madara.ChaptersSinglePageCSS()
@Madara.PagesSinglePageCSS('div.page-break img.wp-manga-chapter-img')
@Common.ImageAjax(true, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('zinmanganet', 'ZinManga(.net)', 'https://www.zinmanga.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}