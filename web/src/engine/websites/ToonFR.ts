import { Tags } from '../Tags';
import icon from './ToonFR.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/webtoon\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonfr', 'ToonFR', 'https://toonfr.com', Tags.Media.Manhwa, Tags.Language.French, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await Madara.FetchChaptersSinglePageAJAXv2.call(this, manga);
        return chapters.map(chapter => new Chapter(this, manga, chapter.Identifier, chapter.Title.replace(' - '+manga.Title, '').trim()));
    }
}