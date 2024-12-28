import { Tags } from '../Tags';
import icon from './MangaForest.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MadTheme from './decorators/MadTheme';

@Common.MangaCSS(/^{origin}\/[^/]+$/, 'div.name.box h1')
@Common.MangasMultiPageCSS('/az-list?page={page}', 'div.manga-list div.title h3 a', 1)
@MadTheme.ChaptersSinglePageAJAXV1()
@Common.PagesSinglePageJS(MadTheme.scriptImageLinks, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaforest', 'MangaForest', 'https://mangaforest.me', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}