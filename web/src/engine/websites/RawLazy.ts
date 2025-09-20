import { Tags } from '../Tags';
import icon from './RawLazy.webp';
import { Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import { ChapterExtractor, CleanTitle, Zing92Base, type APIResult } from './templates/Zing92Base';

@Common.MangaCSS(/^{origin}\/manga-lazy\/[^/]+\/$/, 'title', (element) => CleanTitle(element.textContent.split('|').at(0)))
@Common.ChaptersSinglePageCSS('div.chapters-list a', ChapterExtractor)
export default class extends Zing92Base {

    public constructor() {
        super('rawlazy', 'RawLazy', 'https://rawlazy.io', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(provider, page);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(provider: MangaPlugin, page: number) {

        const request = new Request(new URL(this.zingParams.apiURL, this.URI), {
            credentials: 'include',
            method: 'POST',
            body: new URLSearchParams({
                action: 'z_do_ajax',
                _action: 'loadmore_tr',
                nonce: this.zingParams.nonce,
                p: `${page}`,
                category_id: '0'
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        });

        const { mes: html } = await FetchJSON<APIResult>(request);
        const links = [...new DOMParser().parseFromString(html, 'text/html').querySelectorAll<HTMLAnchorElement>('div.entry-tag h2 a')];
        return links.map(link => new Manga(this, provider, link.pathname, CleanTitle(link.text)));
    }
}
