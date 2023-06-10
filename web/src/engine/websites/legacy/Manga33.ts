import { Tags } from '../../Tags';
import icon from './Manga33.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import * as FlatManga from '../decorators/FlatManga';

@Common.MangaCSS(/^https?:\/\/www\.manga33\.com\/manga\/\S+\.html$/, FlatManga.queryMangaTitle)
@Common.MangasMultiPageCSS('/list/lastdotime-{page}.html', FlatManga.queryMangas, 0)
@Common.PagesSinglePageCSS(FlatManga.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga33', `Manga33`, 'https://www.manga33.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FlatManga.FetchChaptersSinglePageCSS.call(this, manga, FlatManga.queryChapters);
        const fixedChapters = chapters.map(chapter => new Chapter(this, manga, chapter.Identifier.replace(/-\d+.html$/, '-all.html'), chapter.Title));
        const uniqueChapters = fixedChapters.filter(
            (obj, index) =>
                fixedChapters.findIndex((item) => item.Identifier === obj.Identifier) === index
        );
        return uniqueChapters;
    }
}
