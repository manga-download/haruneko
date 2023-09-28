import { Tags } from '../Tags';
import icon from './ManhwaLatino.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manhwa-latino\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageCSS()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwalatino', 'Manhwa-Latino', 'https://manhwa-latino.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await Madara.FetchChaptersSinglePageCSS.call(this, manga, 'ul li.wp-manga-chapter div.mini-letters a');
        return chapters.map(chapter => new Chapter(this, manga, chapter.Identifier, chapter.Title.replace(manga.Title, '').trim()));
    }
}