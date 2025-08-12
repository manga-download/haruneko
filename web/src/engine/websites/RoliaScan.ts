import { Tags } from '../Tags';
import icon from './RoliaScan.webp';
import { FetchCSS } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.post-type-header-inner h1')
@Common.MangasSinglePagesCSS(['/updated-mangas0/'], 'div.article-feed h6.titleh6series a')
@MangaStream.PagesSinglePageCSS([ /warning-\d+\./, /x99-1\./, /join-us-discord\./ ], 'div.manga-child-the-content img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('roliascan', 'Rolia Scan', 'https://roliascan.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(manga.Identifier + 'chapterlist/', this.URI)), 'div#chapter-list a.seenchapter');
        return data.map(({ pathname, text }) => new Chapter(this, manga, pathname, text.replace(manga.Title, '').trim() || manga.Title));
    }
}