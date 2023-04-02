import { Tags } from '../Tags';
import icon from './BacaKomikID.webp';
import { FetchCSS, FetchRequest } from '../FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/bacakomikid\.net\/manga\/[^/]+\/$/)
@MangaStream.ChaptersSinglePageCSS('div.eps_lst ul li span.lchx a')
@MangaStream.PagesSinglePageCSS([ /logo-baca-komik-id/i, /logo-web/i ], 'div.chapter-area div.imgch img[src]:not([src=""])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bacakomikid', 'BacaKomikID', 'https://bacakomikid.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        const uri = new URL('/Xsearch', this.URI);
        for(let page = 1, run = true; run; page++) {
            const request = new FetchRequest(uri.href, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({ page: `${page}` })
            });
            const data = await FetchCSS<HTMLAnchorElement>(request, 'div.bigors a');
            const mangas = data.map(element => new Manga(this, provider, element.pathname, element.text.trim()));
            mangas.length ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }
}