import { Tags } from '../Tags';
import icon from './RawInu.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';
import { FetchCSS, FetchHTML, FetchWindowScript } from '../platform/FetchProvider';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

AddAntiScrapingDetection(async (render) => {
    const dom = await render();
    return dom.documentElement.innerHTML.includes(`ct_anti_ddos_key`) ? FetchRedirection.Automatic : undefined;
});

@Common.MangaCSS(/^{origin}\/[^.]+\.html$/, 'li.breadcrumb-item.active', FlatManga.MangaLabelExtractor)
@Common.MangasMultiPageCSS(FlatManga.pathMultiPageManga, FlatManga.queryMangas, 1, 1, 0, FlatManga.MangaExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('rawinu', `RawInu`, 'https://rawinu.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return await FetchWindowScript(new Request(new URL('/manga-list.html', this.URI)), 'true', 3000, 30000);//trigger antiDDOSS
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
        const chapterid = (await FetchCSS<HTMLInputElement>(request, 'input#chapter'))[0].value;
        request = new Request(new URL(`/app/manga/controllers/cont.imagesChap.php?cid=${chapterid}`, this.URI), {
            headers: {
                'Referer': this.URI.origin
            }
        });
        const nodes = await FetchCSS<HTMLImageElement>(request, 'img');
        return nodes.map(image => new Page(this, chapter, new URL(image.dataset.src, this.URI), { Referer: this.URI.origin }));
    }

}