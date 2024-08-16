﻿import { Tags } from '../Tags';
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

type APIResult = {
    mes: string;
}

const IframeScript = `
    new Promise( (resolve, reject) => {
        const interval = setInterval(function () {
            try {
                if (document.querySelector('#idIframe')) {
                    clearInterval(interval);
                    resolve(document.querySelector('#idIframe').src);
                }
            } catch (error) {
                clearInterval(interval);
                reject(error);
            }
        }, 1000);
        AbortSignal.timeout(10_000).onabort = function({ target: { reason } }) {
            clearInterval(interval);
            reject(reason);
        };
    })

`;

@Common.MangaCSS(/^{origin}\/manga-lazy\/[^/]+\/$/, 'title', MangaLabelExtractor)
@Common.ChaptersSinglePageCSS('div.chapters-list a', ChapterExtractor)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rawlazy', 'RawLazy', 'https://rawlazy.tv', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        const uri = new URL('/wp-admin/admin-ajax.php', this.URI);
        const nonce = await FetchWindowScript<string>(new Request(this.URI), 'zing.nonce');

        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(provider, uri, nonce, page);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(provider: MangaPlugin, uri: URL, nonce: string, page: number) {

        const request = new Request(uri, {
            credentials: 'include',
            method: 'POST',
            body: new URLSearchParams({
                action: 'z_do_ajax',
                _action: 'loadmore',
                nonce: nonce,
                p: page.toString(),
                category_id: '0'
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            }
        });

        const { mes: html } = await FetchJSON<APIResult>(request);
        const dom = new DOMParser().parseFromString(html, 'text/html');
        const links = [...dom.querySelectorAll<HTMLAnchorElement>('div.entry-tag h2 a')];
        return links.map(link => new Manga(this, provider, link.pathname, MangaLabelExtractor.call(this, link)));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI).href;
        let currentUrl = await FetchWindowScript<string>(new Request(chapterUrl), this.Script('.go-to-B'), 1500);
        currentUrl = await FetchWindowScript<string>(new Request(currentUrl), IframeScript, 1500);
        const pages = await FetchCSS<HTMLImageElement>(new Request(currentUrl), 'div.z_content img');
        return pages.map(image => new Page(this, chapter, new URL(image.src)));
    }

    private Script(selector: string): string {
        return `
            new Promise( (resolve, reject) => {
                const interval = setInterval(function () {
                    try {
                        if (document.querySelector('${selector}')?.href != '#') {
                            clearInterval(interval);
                            resolve(document.querySelector('${selector}').href);
                        }
                    } catch (error) {
                        clearInterval(interval);
                        reject(error);
                    }
                }, 1000);
                AbortSignal.timeout(10_000).onabort = function({ target: { reason } }) {
                    clearInterval(interval);
                    reject(reason);
                };
            })
        `;
    }

}
