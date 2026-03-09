import { Tags } from '../Tags';
import icon from './NatsuID.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

const chapterScript = `
    new Promise( resolve => {
        document.querySelector('#chapter-list').dispatchEvent(new Event('getChapterList'));
        setTimeout( () => {
            resolve ( [...document.querySelectorAll('#chapter-list div[data-chapter-number]')].map(chapter => {
                return { id: chapter.querySelector('a').pathname, title : ['Chapter', chapter.dataset.chapterNumber].join(' ').trim()};
            }));
        }, 750);
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'h1[itemprop="name"]')
@Common.ChaptersSinglePageJS(chapterScript, 1000)
@Common.PagesSinglePageJS(`[...document.querySelectorAll('section[data-image-data] img')].map(img => img.src);`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor(id = 'natsuid', label = 'NatsuID', url = 'https://natsu.tv', tags = [Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Japanese] ) {
        super(id, label, url, ...tags);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const nonce = (await FetchCSS<HTMLInputElement>(new Request(new URL('./wp-admin/admin-ajax.php?type=search_form&action=get_nonce', this.URI)), 'input')).at(0).value.trim();
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run ; page++) {
                const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL('./wp-admin/admin-ajax.php?action=advanced_search', this.URI), {
                    method: 'POST',
                    body: new URLSearchParams({
                        nonce,
                        page: `${page}`,
                    }).toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Referer: this.URI.href
                    }
                }), 'a:has(>img)[href*="/manga/"]');
                const mangas = data.map(element => new Manga(this, provider, element.pathname, element.querySelector<HTMLImageElement>('img').alt.trim()));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }
}