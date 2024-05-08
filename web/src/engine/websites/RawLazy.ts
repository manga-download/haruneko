import { Tags } from '../Tags';
import icon from './RawLazy.webp';
import { type Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin, type MangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

function MangaLabelExtractor(element: HTMLElement) {
    const text = element instanceof HTMLAnchorElement ? element.text : element.textContent.split('|')[0].trim();
    return text.replace(/\(Raw.*Free\)/i, '').trim();
}

function ChapterExtractor(this: MangaScraper, anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('span').textContent.trim()
    };
}

const findNextStageScript = `
    new Promise(resolve =>  {
        const interval = setInterval(function () {
            if(jQuery('{BUTTONID}').attr('href') != '#'){
                clearInterval(interval);
                resolve(jQuery('{BUTTONID}').attr('href'));
            }
        }, 500);
    })
`;

type APIResult = {
    mes: string
    url?: string;
}

@Common.MangaCSS(/^{origin}\/manga-lazy\/[^/]+\/$/, 'title', MangaLabelExtractor)
@Common.ChaptersSinglePageCSS('div.chapters-list a', ChapterExtractor)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private nonce: string = undefined;

    public constructor() {
        super('rawlazy', 'RawLazy', 'https://rawlazy.si', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const nonce = await FetchWindowScript<string>(new Request(this.URI), 'zing.nonce');
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider, nonce);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin, nonce: string): Promise<Manga[]> {
        try {

            const body = new URLSearchParams({
                action: 'z_do_ajax',
                _action: 'loadmore',
                nonce: nonce,
                p: page.toString(),
                category_id: '0'
            }).toString();

            const url = new URL('/wp-admin/admin-ajax.php', this.URI);
            const request = new Request(url, {
                credentials: 'include',
                method: 'POST',
                body: body.toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    Referer: this.URI.href,
                    Origin: this.URI.origin,
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const { mes } = await FetchJSON<APIResult>(request);
            const dom = new DOMParser().parseFromString(mes, 'text/html');
            const mangas = [...dom.querySelectorAll<HTMLAnchorElement>('div.entry-tag h2 a')];
            return mangas.map(manga => new Manga(this, provider, manga.pathname, MangaLabelExtractor.call(this, manga)));

        } catch (error) {
            return [];
        }
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);
        const stage2Url = await FetchWindowScript<string>(new Request(chapterUrl), findNextStageScript.replaceAll('{BUTTONID}', '.go-to-B'), 500);
        const stage3Url = await FetchWindowScript<string>(new Request(stage2Url), findNextStageScript.replaceAll('{BUTTONID}', '.go-to-C'), 500);
        const pages = await FetchCSS<HTMLImageElement>(new Request(stage3Url), 'div.z_content img');
        return pages.map(image => new Page(this, chapter, new URL(image.src)));
    }

}
