import { Tags } from '../Tags';
import icon from './MangaGun.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';
import { FetchCSS, FetchHTML, FetchWindowScript, } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/manga-[^/]+\.html$/, FlatManga.queryMangaTitle, FlatManga.MangaLabelExtractor)
@Common.MangasMultiPageCSS(FlatManga.pathMultiPageManga, FlatManga.queryMangas, 1, 1, 0, FlatManga.MangaExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('mangagun', `MangaGun`, 'https://mangagun.net', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        let request = new Request(new URL(manga.Identifier, this.URI), {
            headers: {
                'Referer': this.URI.origin
            }
        });

        const mangaSlug = (await FetchHTML(request)).documentElement.innerHTML.match(/var sLugs\s*=\s*['"]([^'"]+)['"]/)[1];
        const apiUrl = new URL(`/app/manga/controllers/cont.Listchapter.php?slug=${mangaSlug}`, this.URI);
        request = new Request(apiUrl, {
            headers: {
                'Referer': this.URI.origin
            }
        });
        const data = await FetchCSS<HTMLAnchorElement>(request, 'a');
        return data.map(chapter => new Chapter(this, manga, chapter.pathname, chapter.title.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        let request = new Request(new URL(chapter.Identifier, this.URI), {
            headers: {
                'Referer': this.URI.origin
            }
        });

        const chapterid = await FetchWindowScript<string>(request, `document.querySelector('input#chapter').value`, 3000);//increased delay for AntiScrapper
        const apiUrl = new URL(`/app/manga/controllers/cont.Showimage.php?cid=${chapterid}`, this.URI);
        request = new Request(apiUrl, {
            headers: {
                'Referer': this.URI.origin
            }
        });
        const data = await FetchCSS<HTMLImageElement>(request, 'img');
        return data.map(picture => new Page(this, chapter, new URL(picture.dataset.src, this.URI), { Referer: this.URI.origin }));
    }
}
