import { FetchJSON, FetchWindowScript } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from "../../providers/MangaPlugin";
import * as Common from '../decorators/Common';
import * as Grouple from '../decorators/Grouple';

type APIChapters = {
    data: {
        chapters: {
            chapter_name: string;
            chapter_slug: string;
        }[];
    }
};

const pageScript = `
    new Promise(resolve => {
        const mainserver = cdns.at(0);
        resolve( [...document.querySelectorAll('div.container-chapter-reader > img')].map ( image  => {
            const imagePath = new URL(image.dataset.src || image.src ).pathname;
            const mirrors = Array.from(new Set(backupImage.map(server => new URL(imagePath, server).href)));
            return { url : new URL(imagePath, mainserver).href, mirrors };
        }));
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'ul.manga-info-text li h1')
@Common.MangasMultiPageCSS('div.list-comic-item-wrap a.list-story-item', Common.PatternLinkGenerator('/manga-list/latest-manga?page={page}'), 500, Common.AnchorInfoExtractor(true))
@Grouple.ImageWithMirrors()
export class MangaNel extends DecoratableMangaScraper {

    public override async FetchPages(chapter: Chapter): Promise<Page<any>[]> {
        const data = await FetchWindowScript<{ url: string, mirrors: string[] }[]>(new Request(new URL(chapter.Identifier, this.URI)), pageScript, 1000);
        return data.map(({ url, mirrors }) => new Page(this, chapter, new URL(url), { Referer: this.URI.href, mirrors }));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data: { chapters } } = await FetchJSON<APIChapters>(new Request(new URL(`./api/manga/${manga.Identifier.split('/').at(-1)}/chapters?limit=-1`, this.URI)));
        return chapters.map(({ chapter_slug: slug, chapter_name: name }) => new Chapter(this, manga, `${manga.Identifier}/${slug}`, name));
    }
}