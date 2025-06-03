import { Tags } from '../Tags';
import icon from './DisasterScans.webp';
import { Chapter, DecoratableMangaScraper, type Manga, type MangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchNextJS } from '../platform/FetchProvider';

type HydratedChapterData = {
    chapterID: number,
    ChapterName: string,
    ChapterNumber: string,
}[];

function MangaExtractor(element: HTMLMetaElement) {
    return element.content.split('- Disaster Scans').at(0).trim();
}

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLHeadingElement>('div div h1').textContent.trim()
    };
}

function PageLinkExtractor(this: MangaScraper, image: HTMLImageElement): string {
    return new URL(image.getAttribute('src'), this.URI).searchParams.get('url') ?? image.getAttribute('src');
}

@Common.MangaCSS(/^{origin}\/comics\/[^/]+$/, 'meta[property="og:title"]', MangaExtractor)
@Common.MangasSinglePagesCSS([ '/comics' ], 'div.grid > a[href*="/comics/"]', MangaInfoExtractor)
@Common.PagesSinglePageCSS('section.container div img', PageLinkExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private nextBuild = '';

    public constructor() {
        super('disasterscans', 'Disaster Scans', 'https://disasterscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(`${manga.Identifier}`, this.URI));
        const data = await FetchNextJS(request, data => this.ExtractValue(data, 'chapters'));
        const entries = this.ExtractValue<HydratedChapterData>(data, 'chapters');
        return entries.map(chapter => {
            const title = [ `Chapter ${chapter.ChapterNumber}`, chapter.ChapterName ].filter(segment => segment).join(' - ');
            return new Chapter(this, manga, `${manga.Identifier}/${chapter.chapterID}-chapter-${chapter.ChapterNumber}`, title);
        });
    }

    /**
     * Scans the the given {@link data} object recursively searching for the first occurence of the given {@link key}
     * and returns the corresponding value, or `undefined` if non was found.
     */
    private ExtractValue<T extends JSONElement>(data: JSONElement, key: string | number): T {
        if(data && typeof data === 'object') {
            if(key in data) return data[key];
            for(const value of Object.values(data)) {
                const result = this.ExtractValue<T>(value, key);
                if(result) return result;
            }
        }
        return undefined;
    }
}