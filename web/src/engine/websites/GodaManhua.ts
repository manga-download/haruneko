import { Tags } from '../Tags';
import icon from './GodaManhua.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIPages = {
    data: {
        info: {
            images: {
                line: number,
                images: {
                    url: string
                }[]
            }
        }
    }
}

export const chapterScript = `
    [ ...document.querySelectorAll('.chapteritem > a') ].map(element => ({
        id: new URLSearchParams({ m: element.dataset.ms, c: element.dataset.cs }).toString(),
        title: element.dataset.ct.trim(),
    }));
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'nav ol li:last-of-type a')
@Common.MangasMultiPageCSS('/manga/page/{page}', 'div.cardlist a')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private apiUrl = 'https://api-get-v2.mgsearcher.com/api/';

    public constructor() {
        super('godamanhua', 'GodaManhua', 'https://baozimh.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(manga.Identifier.replace('/manga/', '/chapterlist/'), this.URI));
        const chapters = await FetchWindowScript<{ id: string, title: string }[]>(request, chapterScript, 2000);
        //return chapters.map(chapter => new Chapter(this, manga, chapter.id, chapter.title.replace(manga.Title, '').trim() || chapter.title));
        return chapters.map(chapter => new Chapter(this, manga, `./chapter/getinfo?${chapter.id}`, chapter.title.replace(manga.Title, '').trim() || chapter.title));
    }

    // TODO: Simplify?
    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        // ./chapter/getcontent?${chapter.id}
        const request = new Request(new URL(chapter.Identifier, this.apiUrl), {
            headers: {
                Referer: this.URI.href,
                Origin: this.URI.origin
            }
        });
        const { data: { info: { images: { line, images } } } } = await FetchJSON<APIPages>(request);
        const CDN = line === 2 ? 'https://f40-1-4.g-mh.online' : 'https://t40-1-4.g-mh.online';
        return images.map(page => new Page(this, chapter, new URL(page.url, CDN), { Referer: this.URI.href }));
    }
}