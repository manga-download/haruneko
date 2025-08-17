import { type Tag, Tags } from '../Tags';
import icon from './MangaplusTV.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

const chapterLanguageMap = new Map([
    ['en', Tags.Language.English],
    ['jp', Tags.Language.Japanese],
    ['vn', Tags.Language.Vietnamese],
    ['th', Tags.Language.Thai],
    ['es', Tags.Language.Spanish],
    ['ind', Tags.Language.Indonesian],
    ['br', Tags.Language.Portuguese],
    ['fr', Tags.Language.French],
]);

// TODO: Check for possible revision

@Common.MangaCSS(/^{origin}\/truyen-tranh\/[^/]+$/, 'ol.breadcrumb li:last-of-type a')
@Common.MangasMultiPageCSS('/truyen-tranh-hay/trang-{page}.html', 'div.story-item h3.title-book a')
@Common.PagesSinglePageCSS('div.story-see-content img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaplustv', 'MangaPlus.tv', 'https://mangaplus.shueisha.tv', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const languagesPages = await FetchCSS<HTMLAnchorElement>(new Request(new URL(manga.Identifier, this.URI)), 'div.head-chapter-list div > a');
        const promises = languagesPages.map(page => this.ExtractChapters(manga, new URL(page.pathname, this.URI)));
        return (await Promise.all(promises)).flat();
    }

    private async ExtractChapters(manga : Manga, endpoint: URL): Promise<Chapter[]> {
        const data = await FetchCSS<HTMLAnchorElement>(new Request(endpoint), 'div.works-chapter-item a');
        return data.map(chapter => new Chapter(this, manga, chapter.pathname, chapter.textContent.trim(), ...this.ExtractLanguage(chapter.pathname)));
    }

    private ExtractLanguage(slug: string): Tag[] {
        const key = slug.replace(/\.html$/, '').split('-').at(-1).trim();
        return chapterLanguageMap.has(key) ? [chapterLanguageMap.get(key)] : [];
    }
}