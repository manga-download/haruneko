import { Tags } from '../Tags';
import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import { RateLimit } from '../taskpool/RateLimit';
import icon from './YupManga.webp';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/series\.php\?id=/, 'div.container div.flex h1', Common.WebsiteInfoExtractor({ includeSearch: true }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.comic-card a', Common.PatternLinkGenerator('/?page={page}'), 0, anchor => ({ id: anchor.pathname+anchor.search, title: anchor.querySelector('img').alt.trim() }))
@Common.PagesSinglePageJS(`new Array(readerApp.totalPages).fill(0).map((_, index) => new URL('/image-proxy-v2.php?chapter='+ readerApp.chapterId+'&page='+(index+1)+'&context=reader', window.location).href)`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('yupmanga', 'YupManga', 'https://www.yupmanga.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Aggregator);
        this.imageTaskPool.RateLimit = new RateLimit(2, 1);
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
                    return new Chapter(this, manga, anchor.pathname.replace('/box-modal.php', '/reader_v2.php') + anchor.search, anchor.querySelector<HTMLImageElement>('img').alt.trim());
                });
                chapters.length > 0 ? yield* chapters : run = false;
            }

        }.call(this));
    }

}