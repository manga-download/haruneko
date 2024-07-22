import { Tags } from '../Tags';
import icon from './WeLoveManga.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';
import { FetchCSS, FetchHTML, FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/(mgraw-)?\d+\/$/, FlatManga.queryMangaTitle, FlatManga.MangaLabelExtractor)
@Common.MangasMultiPageCSS(FlatManga.pathMultiPageManga, FlatManga.queryMangas, 1, 1, 0, FlatManga.MangaExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('welovemanga', `WeloveManga`, 'https://welovemanga.one', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return await FetchWindowScript(new Request(new URL('/manga-list.html', this.URI)), 'true', 3000, 15000);//trigger antiDDOSS
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        let request = new Request(new URL(manga.Identifier, this.URI), {
            headers: {
                'Referer': this.URI.origin
            }
        });
        const mangaSlug = (await FetchHTML(request)).documentElement.innerHTML.match(/var mIds\s*=\s*['"]([^'"]+)['"]/)[1];
        const apiUrl = new URL(`/app/manga/controllers/cont.Listchapter.php?mid=${mangaSlug}`, this.URI);
        request = new Request(apiUrl, {
            headers: {
                'Referer': this.URI.origin
            }
        });
        const data = await FetchCSS<HTMLAnchorElement>(request, 'a');
        return data.map(chapter => new Chapter(this, manga, chapter.pathname, chapter.title.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const url = new URL(chapter.Identifier, this.URI);
        let request = new Request(url.href, {
            headers: {
                'Referer': this.URI.origin,
            }
        });
        const chapterid = (await FetchCSS<HTMLInputElement>(request, 'input#chapter'))[0].value;
        request = new Request(new URL(`/app/manga/controllers/cont.listImg.php?cid=${chapterid}`, this.URI), {
            headers: {
                'Referer': this.URI.origin,
            }
        });
        const nodes = await FetchCSS(request, 'img.chapter-img:not([alt*="nicoscan"])');
        return nodes.map(image => new Page(this, chapter, new URL(image.dataset.srcset.replace(/\n/g, ''), this.URI), { Referer: this.URI.origin }));
    }

}