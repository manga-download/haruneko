import { Tags } from '../Tags';
import icon from './WeLoveManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';

@Common.MangaCSS(/^https?:\/\/welovemanga\.one\/\S+\/$/, FlatManga.queryMangaTitle, FlatManga.MangaLabelExtractor)
@Common.MangasMultiPageCSS('/manga-list.html?page={page}', FlatManga.queryMangas,1,1,0, FlatManga.MangaExtractor)
@FlatManga.ChaptersSinglePageCSS()
@Common.PagesSinglePageCSS(FlatManga.queryPages)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lovehug', `WeLoveManga.One`, 'https://welovemanga.one', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}