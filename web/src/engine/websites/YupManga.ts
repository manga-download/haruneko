import { Tags } from '../Tags';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import { RateLimit } from '../taskpool/RateLimit';
import icon from './YupManga.webp';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/series\.php\?id=/, 'div.container div.flex h1', Common.WebsiteInfoExtractor({ includeSearch: true }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.comic-card a', Common.PatternLinkGenerator('/?page={page}'), 0, anchor => ({ id: anchor.pathname + anchor.search, title: anchor.querySelector('img').alt.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('yupmanga', 'YupManga', 'https://www.yupmanga.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Aggregator);
        this.imageTaskPool.RateLimit = new RateLimit(2, 2);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaId = new URL(manga.Identifier, this.URI).searchParams.get('id');
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { html } = await FetchJSON<{ html: string }>(new Request(new URL(`./ajax/load_chapters.php?series_id=${mangaId}&page=${page}&order=oldest_first&_=${Date.now()}`, this.URI)));
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const chapters = [...doc.querySelectorAll<HTMLAnchorElement>('div.comic-card a')].map(anchor => {
                    return new Chapter(this, manga, `/${anchor.dataset.reader}?chapter=${anchor.dataset.chapter}`, anchor.querySelector<HTMLImageElement>('img').alt.trim());
                });
                chapters.length > 0 ? yield* chapters : run = false;
            }

        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pageScript = `new Array(readerApp.totalPages).fill(0).map((_, index) => new URL('/image-proxy-v2.php?chapter='+ readerApp.chapterId+'&page='+(index+1)+'&context=preload&token='+encodeURIComponent(new URL(location).searchParams.get('token')), location).href)`;
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        const { token } = await FetchJSON<{token: string}>(new Request(new URL(`./ajax/get_reader_token.php?chapter=${encodeURIComponent(chapterUrl.searchParams.get('chapter'))}`, this.URI), {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        }));
        chapterUrl.searchParams.set('token', encodeURIComponent(token));
        const pages = await FetchWindowScript<string[]>(new Request(chapterUrl), pageScript, 500);
        return pages.map(page =>new Page(this, chapter, new URL(page), { Referer: this.URI.href }));
    }
}