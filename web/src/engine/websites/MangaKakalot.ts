import { Tags } from '../Tags';
import icon from './MangaKakalot.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaNel from './decorators/MangaNel';
import * as Common from './decorators/Common';

@MangaNel.MangaCSS(/^https?:\/\/mangakakalot\.com\/(manga\/|read-)[^/]+$/, 'div.manga-info-top ul.manga-info-text h1')
@MangaNel.MangasMultiPageCSS('/manga_list?type=new&category=all&alpha=all&state=all&group=all&page={page}', 'div.truyen-list h3 a')
@MangaNel.ChaptersSinglePageCSS()
@MangaNel.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakakalot', 'MangaKakalot', 'https://mangakakalot.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}