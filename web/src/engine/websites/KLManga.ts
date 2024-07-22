import { Tags } from '../Tags';
import icon from './KLManga.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';
import { FetchCSS, FetchHTML } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/[^/]+\.html$/, FlatManga.queryMangaTitle)
@Common.MangasSinglePageCSS(FlatManga.pathSinglePageManga, FlatManga.queryMangas)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('klmanga', `KLManga`, 'https://klz9.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
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
        const mangaSlug = (await FetchHTML(request)).documentElement.innerHTML.match(/var dataL\s*=\s*['"]([^'"]+)['"]/)[1];
        const apiUrl = this.GenerateRandomEndPoint(25, '.lstc');
        apiUrl.searchParams.set('slug', mangaSlug);
        request = new Request(apiUrl, {
            headers: {
                'Referer': this.URI.origin
            }
        });
        const data = await FetchCSS<HTMLAnchorElement>(request, 'a.chapter[title]');
        return data.map(chapter => new Chapter(this, manga, chapter.pathname, chapter.title.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        let request = new Request(new URL(chapter.Identifier, this.URI), {
            headers: {
                'Referer': this.URI.origin
            }
        });

        const chapterid = (await FetchCSS<HTMLInputElement>(request, 'input#chapter'))[0].value;
        const apiUrl = this.GenerateRandomEndPoint(30, '.iog');
        apiUrl.searchParams.set('cid', chapterid);
        request = new Request(apiUrl, {
            headers: {
                'Referer': this.URI.origin
            }
        });
        const data = await FetchCSS<HTMLImageElement>(request, 'img.chapter-img[alt*="Page"]');
        return data
            .map(picture => new Page(this, chapter, new URL(picture.getAttribute('src'), this.URI), { Referer: this.URI.origin }))
            .filter(page => !page.Link.href.match(/olimposcan/));
    }

    private GenerateRandomEndPoint(length: number, suffix: string): URL {
        const r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomEndpoint = '';
        for (let o = 0; o < length; o++) randomEndpoint += r.charAt(Math.floor(Math.random() * r.length));
        return new URL(randomEndpoint + suffix, this.URI);
    }

}