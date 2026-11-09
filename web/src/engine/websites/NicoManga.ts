import { Tags } from '../Tags';
import icon from './NicoManga.webp';
import { FetchRegex, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { queryMangas, CleanTitle } from './templates/FlatManga';
import { GetBytesFromUTF8, GetUTF8FromBytes } from '../BufferEncoder';

function ClipBoardExtractor(element: HTMLElement, uri: URL) {
    return {
        id: uri.pathname,
        title: CleanTitle(element.textContent.split('-').slice(0, -1).join('-').trim())
    };
}

type JSONManga = {
    chapters_list: {
        chapter: string;
        ur: string;
    }[];
};

type JSONPages = {
    images: string[];
};

@Common.MangaCSS(/^{origin}\/manga\d+\/[^/]+\.html$/, 'title', ClipBoardExtractor)
@Common.MangasMultiPageCSS<HTMLAnchorElement>(queryMangas, Common.PatternLinkGenerator('/manga-list.html?p={page}'), 0, anchor => ({ id: anchor.pathname, title: CleanTitle(anchor.text) }))

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nicomanga', 'NicoManga', 'https://nicomanga.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('unlock_chapter_guest', '1')`);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const result = await this.FetchChaotic<JSONManga>(manga.Identifier, data => typeof data === 'object' && data !== null && 'chapters_list' in data);
        if (!result) return [];
        return result.chapters_list.map(({ chapter, ur }) => new Chapter(this, manga, new URL(ur, this.URI).pathname, `Chapter ${chapter}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const result = await this.FetchChaotic<JSONPages>(chapter.Identifier, data => typeof data === 'object' && data !== null && 'images' in data);
        if (!result) return [];
        return result.images.map(image => new Page(this, chapter, new URL(image, this.URI)));
    }

    private async FetchChaotic<T extends JSONElement>(endpoint: string, predicate: (data: JSONElement) => unknown, key: string = 'NicoMangaX2'): Promise<T | null> {
        const candidates = await FetchRegex(new Request(new URL(endpoint, this.URI)), /([\u4E00-\u9FFF]{10,})/g);
        for (const candidate of candidates) {
            const result = this.DecryptPayload<T>(candidate, key);
            if (result && predicate(result)) return result;
        }
        return null;
    }

    private DecryptPayload<T extends JSONElement>(message: string, key: string): T {
        let result = null;
        try {
            const keybytes = GetBytesFromUTF8(key);
            const decrypted = message.split('').map((char, index) => {
                return (char.codePointAt(0) || 0 - 19968) ^ keybytes[index % keybytes.length];
            });

            result = JSON.parse(GetUTF8FromBytes(new Uint8Array(decrypted)));
        } catch { }
        return result;
    }
}