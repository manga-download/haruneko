import { Tags } from '../Tags';
import icon from './RoliaScan.webp';
import { FetchCSS } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.post-type-header-inner h1')
@Common.MangasSinglePagesCSS(['/updated-mangas0/'], 'div.article-feed h6.titleh6series a')
@MangaStream.PagesSinglePageCSS([/warning-\d+\.(png|jpg)$/, /x99-1\.(png|jpg)$/, /join-us-discord\.(png|jpg)$/], 'div.manga-child-the-content img')
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('roliascan', 'Rolia Scan', 'https://roliascan.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(`${manga.Identifier}chapterlist/`, this.URI)), 'div#chapter-list a.seenchapter');
        return data.map(chapter => {
            const { id, title } = Common.AnchorInfoExtractor().call(this, chapter);
            return new Chapter(this, manga, id, title.replace(manga.Title, '').trim() || manga.Title);
        });
    }
}