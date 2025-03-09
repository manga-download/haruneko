import { Tags } from '../Tags';
import icon from './GodaManhua.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

export type ChapterID = {
    mangaid: string,
    id: string
}

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
    new Promise (resolve => {
        resolve ([...document.querySelectorAll('div.chapteritem a')].map(chapter => {
            return {
                id: JSON.stringify({mangaid : chapter.dataset.ms, id: chapter.dataset.cs}),
                title: chapter.dataset.ct.trim()
            }
        }));
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'nav ol li:last-of-type a')
@Common.MangasMultiPageCSS('/manga/page/{page}', 'div.cardlist a')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    protected apiUrl = 'https://api-get-v2.mgsearcher.com/api/';

    public constructor(id = 'godamanhua', label = 'GodaManhua', url = 'https://baozimh.org', tags = [Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator]) {
        super(id, label, url, ...tags );
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(manga.Identifier.replace('/manga/', '/chapterlist/'), this.URI));
        const chapters = await FetchWindowScript<{ id: string, title: string }[]>(request, chapterScript, 2000);
        return chapters.map(chapter => new Chapter(this, manga, chapter.id, chapter.title.replace(manga.Title, '').trim() || chapter.title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { mangaid, id } = JSON.parse(chapter.Identifier) as ChapterID;
        const request = new Request(new URL(`./chapter/getinfo?m=${mangaid}&c=${id}`, this.apiUrl), {
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