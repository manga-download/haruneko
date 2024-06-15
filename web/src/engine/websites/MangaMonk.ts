import { Tags } from '../Tags';
import icon from './MangaMonk.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MadTheme from './decorators/MadTheme';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+$/, 'div.name.box h1')
@Common.MangasMultiPageCSS('/az-list?page={page}', 'div.list div.title h3 a', 1)
@MadTheme.ChaptersSinglePageAJAX()
@MadTheme.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangamonk', 'MangaMonk', 'https://mangamonk.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}