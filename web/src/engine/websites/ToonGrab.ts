import { Tags } from '../Tags';
import { FetchJSON, FetchNextJS } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, Chapter, Page } from '../providers/MangaPlugin';
import icon from './ToonGrab.webp';
import * as Common from './decorators/Common';

type APIChapters = {
    chapters: {
        chapterNumber: number;
    }[];
};

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/manga\/[^/]+$/, 'div[class*="__seriesCover"] img', (img, uri) => ({
    id: uri.pathname,
    title: img.alt.trim(),
}))
@Common.MangasMultiPageCSS('div#browse-results a:has(p)', Common.PatternLinkGenerator('/browse?page={page}'))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('toongrab', 'ToonGrab', 'https://toongrab.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { chapters } = await FetchJSON<APIChapters>(new Request(new URL(`./manga/${manga.Identifier.split('/').at(-1)}/chapters?page=${page}&limit=100&sort=desc`, this.apiURL)));
                const mangas = chapters.map(({ chapterNumber }) => new Chapter(this, manga, `${chapterNumber}`, `Chapter ${chapterNumber}`));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = await FetchNextJS<{ images: string[] }>(new Request(new URL(`${chapter.Parent.Identifier}/chapter-${chapter.Identifier}`, this.URI)), data => 'images' in data && 'chapterNumber');
        return images.map(image => new Page(this, chapter, new URL(image, this.URI), { Referer: this.URI.href }));
    }
}