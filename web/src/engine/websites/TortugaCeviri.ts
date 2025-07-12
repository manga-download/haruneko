import { Tags } from '../Tags';
import icon from './TortugaCeviri.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Tortuga Çeviri"])')
@Madara.MangasMultiPageAJAX()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('tortugaceviri', 'Tortuga Çeviri', 'https://tortugaceviri.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await Madara.FetchChaptersSinglePageAJAXv2.call(this, manga);
        return chapters.map(chapter => new Chapter(this, manga, chapter.Identifier, chapter.Title.replaceAll(manga.Title, '').trim()));
    }
}