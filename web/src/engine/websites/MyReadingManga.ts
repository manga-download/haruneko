import { Tags } from '../Tags';
import icon from './MyReadingManga.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, '.entry-title')
@Common.MangasMultiPageCSS('a.entry-title-link', Common.PatternLinkGenerator('/yaoi-manga/page/{page}/'))
@Common.PagesSinglePageCSS('img.img-myreadingmanga')
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('myreadingmanga', `MyReadingManga`, 'https://myreadingmanga.info', Tags.Language.English, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [lastChapter] = await FetchCSS<HTMLAnchorElement>(new Request(new URL(manga.Identifier, this.URI)), 'a.page-numbers:not(.next):nth-last-child(2)');
        const lastChapterNumber = lastChapter ? parseInt(lastChapter.text.trim()) : 1;
        return Array.from({ length: lastChapterNumber }, (_, index) => new Chapter(this, manga, `${manga.Identifier}${index + 1}/`, `${index + 1}`));
    }
}