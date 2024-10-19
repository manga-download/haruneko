import { Tags } from '../Tags';
import icon from './Digimon.webp';
import { type Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function ChapterScript(mangaId: string): string {
    return `new Promise(resolve => {
        resolve([...document.querySelectorAll('div[id="${mangaId}"] li.pg-ep_list__item a')].map(chapter => {
            return {
                id: new URL(chapter.pathname, window.location).pathname,
                title: chapter.text.trim()
            }
        }).filter(element => element.id != window.location.pathname));
    });
`;
}

@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.swiper ul li[aria-label] > img')].reverse().map(image => new URL(image.src, window.location).href);`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly mangaIdRegexp = new RegExp(/#([^/]+$)/);

    public constructor() {
        super('digimon', 'Digimon', 'https://digimon.net', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/digimoncomic/(en/)?#[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaId = url.match(this.mangaIdRegexp)[1];
        const title = (await FetchCSS<HTMLDivElement>(new Request(new URL(url, this.URI)), `div.digimoncomic div.pg-container > div[id="${mangaId}"] h3.pg-works_tit__tit`)).shift().textContent;
        return new Manga(this, provider, `${new URL(url).pathname}#${mangaId}`, title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const paths = ['/digimoncomic/', '/digimoncomic/en/'];
        const mangaList: Manga[] = [];
        for (let path of paths) {
            const data = await FetchCSS<HTMLDivElement>(new Request(new URL(path, this.URI)), 'div.digimoncomic div.pg-container > div[data-inview]');
            mangaList.push(...data.map(manga => new Manga(this, provider, `${path}#${manga.id}`, manga.querySelector<HTMLHeadingElement>('h3.pg-works_tit__tit').textContent.trim())));
        };
        return mangaList;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return Common.FetchChaptersSinglePageJS.call(this, manga, ChapterScript(manga.Identifier.match(this.mangaIdRegexp)[1]), 2000);
    }

}
