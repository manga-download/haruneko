import { FetchCSS, FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, type MangaPlugin, Page, type Manga } from '../../providers/MangaPlugin';
import * as Grouple from '../decorators/Grouple';
import * as Common from '../decorators/Common';

type APIChapters = {
    data: {
        chapters: {
            chapter_name: string;
            chapter_slug: string;
        }[];
    };
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'ul.manga-info-text li h1')
@Grouple.ImageWithMirrors()
export class MangaNel extends DecoratableMangaScraper {

    public override async Initialize(): Promise<void> {
        return await FetchWindowScript(new Request(new URL('/manga/manga-list/', this.URI)), '');
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const [anchor] = await FetchCSS<HTMLAnchorElement>(new Request(new URL('/manga-list/latest-manga?page=1', this.URI)), 'div.group_page a.page_last');
        const generate = Common.StaticLinkGenerator(...Array.from({
            length: parseInt(new URL(anchor.href).searchParams.get('page'), 10),
        }, (_, index) => `/manga-list/latest-manga?page=${index + 1}`));
        return Common.FetchMangasMultiPageCSS.call(this, provider, 'div.list-comic-item-wrap a.list-story-item:not([target])', generate, 750, Common.AnchorInfoExtractor(true));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { chapters } } = await FetchJSON<APIChapters>(new Request(new URL(`./api/manga/${manga.Identifier.split('/').at(-1)}/chapters?limit=-1`, this.URI)));
        return chapters.map(({ chapter_slug: slug, chapter_name: name }) => new Chapter(this, manga, `${manga.Identifier}/${slug}`, name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await FetchWindowScript<{ url: string, mirrors: string[] }[]>(new Request(new URL(chapter.Identifier, this.URI)), `
            new Promise(resolve => {
                const mainserver = cdns.at(0);
                resolve( [...document.querySelectorAll('div.container-chapter-reader > img')].map ( image  => {
                    const imagePath = new URL(image.dataset.src || image.src ).pathname;
                    const mirrors = Array.from(new Set(backupImage.map(server => new URL(imagePath, server).href)));
                    return { url : new URL(imagePath, mainserver).href, mirrors };
                }));
            });
        `, 1000);
        return data.map(({ url, mirrors }) => new Page(this, chapter, new URL(url), { Referer: this.URI.href, mirrors }));
    }
}