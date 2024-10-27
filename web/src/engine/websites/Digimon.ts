import { Tags } from '../Tags';
import icon from './Digimon.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

const chapterScript = `
    new Promise(resolve => {
        const mangaId = window.location.hash.replace('#', '');
        resolve([...document.querySelectorAll('div[id="'+mangaId+'"] li.pg-ep_list__item a')].map(chapter => {
            return {
                id: new URL(chapter.pathname, window.location).pathname,
                title: chapter.text.trim()
            }
        }).filter(element => element.id != window.location.pathname));
    });
`;

@Common.ChaptersSinglePageJS(chapterScript, 500)
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.swiper ul li[aria-label] > img')].reverse().map(image => new URL(image.src, window.location).href);`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('digimon', 'Digimon', 'https://digimon.net', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/digimoncomic/(en/)?#`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const uri = new URL(url);
        const title = (await FetchCSS<HTMLDivElement>(new Request(uri), `div.digimoncomic div.pg-container > div[id="${uri.hash.replace('#', '')}"] h3.pg-works_tit__tit`)).shift().textContent;
        return new Manga(this, provider, `${uri.pathname}${uri.hash}`, title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const paths = ['/digimoncomic/', '/digimoncomic/en/'];
        const mangaList: Manga[] = [];
        for (const path of paths) {
            const data = await FetchCSS<HTMLDivElement>(new Request(new URL(path, this.URI)), 'div.digimoncomic div.pg-container > div[data-inview]');
            mangaList.push(...data.map(manga => new Manga(this, provider, `${path}#${manga.id}`, manga.querySelector<HTMLHeadingElement>('h3.pg-works_tit__tit').textContent.trim())));
        };
        return mangaList;
    }

}
