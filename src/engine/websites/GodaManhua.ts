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
                images: { url: string }[]
            }
        }
    }
}

export async function FetchChapters(this: DecoratableMangaScraper, manga: Manga, prefix: string = ''): Promise<Chapter[]> {
    const script = `
        [ ...document.querySelectorAll('.chapteritem > a') ].map(element => ({
            id: new URLSearchParams({ m: element.dataset.ms, c: element.dataset.cs }).toString(),
            title: element.dataset.ct.trim(),
        }));
    `;

    const request = new Request(new URL(manga.Identifier.replace('/manga/', '/chapterlist/'), this.URI));
    const chapters = await FetchWindowScript<{ id: string, title: string }[]>(request, script, 2000);
    return chapters.map(chapter => new Chapter(this, manga, prefix + chapter.id, chapter.title.replace(manga.Title, '').trim() || chapter.title));
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'nav ol li:last-of-type a')
@Common.MangasMultiPageCSS('div.cardlist a', Common.PatternLinkGenerator('/manga/page/{page}'))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private apiUrl = 'https://api-get-v3.mgsearcher.com/api/'; // https://m.g-mh.org/api/
    private imageCDN = {
        0: 'https://t40-1-4.g-mh.online',
        2: 'https://f40-1-4.g-mh.online',
    };

    public constructor() {
        super('godamanhua', 'GodaManhua', 'https://baozimh.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return FetchChapters.call(this, manga, './chapter/getinfo?');
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(chapter.Identifier, this.apiUrl), {
            headers: { Referer: this.URI.href }
        });
        const { data: { info: { images: { line, images } } } } = await FetchJSON<APIPages>(request);
        return images.map(page => new Page(this, chapter, new URL(page.url, this.imageCDN[line] ?? this.imageCDN[0]), { Referer: this.URI.href }));
    }
}