import { Tags } from '../Tags';
import icon from './NatsuID.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

const chapterScript = `
    new Promise( resolve => {
        document.querySelector('#chapter-list').dispatchEvent(new Event('getChapterList'));
        setTimeout( () => {
            resolve ( [...document.querySelectorAll('#chapter-list a')].map(chapter => {
                return { id: chapter.pathname, title : chapter.querySelector('span').textContent.trim()};
            }));
        }, 750);
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'h1[itemprop="name"]')
@Common.ChaptersSinglePageJS(chapterScript, 1000)
@Common.PagesSinglePageJS(`[...document.querySelectorAll('section[data-image-data] img')].map(img => img.src);`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('natsuid', 'NatsuID', 'https://natsu.tv', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const nonce = (await FetchCSS<HTMLInputElement>(new Request(new URL('./wp-admin/admin-ajax.php?type=search_form&action=get_nonce', this.URI)), 'input')).at(0).value.trim();
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider, nonce);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin, nonce: string): Promise<Manga[]> {
        const request = new Request(new URL('./wp-admin/admin-ajax.php?action=advanced_search', this.URI), {
            method: 'POST',
            body: new URLSearchParams({
                nonce,
                page: `${page}`,
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Referer: this.URI.href
            }
        });
        const data = await FetchCSS<HTMLAnchorElement>(request, 'a:has(>img)[href*="/manga/"]');
        return data.map(element => new Manga(this, provider, element.pathname, element.querySelector<HTMLImageElement>('img').alt.trim()));
    }
}