import { Tags } from '../Tags';
import icon from './JapScan.webp';
import { DecoratableMangaScraper, type Manga, Chapter, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';
import { FetchWindowScript } from '../platform/FetchProvider';
import GetIPC from '../platform/InterProcessCommunication';
import { Diagnostics as DiagnosticsChannels } from '../../../../app/src/ipc/Channels';
import { DRMProvider } from './JapScan.DRM';

AddAntiScrapingDetection(async invoke => {
    // JapScan's own anti-bot (the "Glisse pour remettre dans l'ordre" puzzle) is announced by
    // `window.__captcha.needed === true` BEFORE its `#jc-overlay` node is rendered. Detect both so
    // the reader window is shown and the user can solve it; otherwise the page stays locked.
    const result = await invoke<boolean>(`!!document.querySelector('#jc-overlay') || (window.__captcha && window.__captcha.needed === true) || false;`);
    return result ? FetchRedirection.Interactive : undefined;
}, /^https:\/\/(?:www\.)?japscan\.[a-z]{2,4}/);

@Common.MangaCSS<HTMLHeadingElement>(/^https:\/\/(?:www\.)?japscan\.[a-z]{2,4}\/(manga|manhwa|bd)\/[^/]+\/$/, '#main div.card-body h1', (head, uri) => ({ id: uri.pathname, title: head.innerText.replace(/^man[gh][wu]?a\s+/i, '') }))
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    // JapScan présente un challenge interactif (#jc-overlay) qui nécessite une
    // vraie fenêtre visible — la vérification silencieuse saute donc ce site.
    public override readonly RequiresVisibleBrowserWindow = true;

    readonly #drm = new DRMProvider();

    public constructor() {
        super('japscan', 'JapScan', 'https://www.japscan.foo', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon(): string {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return this.#drm.Initialize(this.URI);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return [
            ... await Common.FetchMangasMultiPageCSS.call(this, provider, 'div.mangas-list div.manga-block a', Common.PatternLinkGenerator('/mangas/?p={page}'), 2500),
            ... await Common.FetchMangasMultiPageCSS.call(this, provider, 'div.mangas-list div.manga-block a', Common.PatternLinkGenerator('/bds/?p={page}'), 2500),
        ];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.#drm.CreateChapterList(new URL(manga.Identifier, this.URI));
        return chapters.map(({ id, title }) => new Chapter(this, manga, id, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const referer = new URL(chapter.Identifier, this.URI).href;
        const chapterURL = new URL(chapter.Identifier, this.URI);

        // The reader decodes its page list through `String.prototype.replace`, which the DRM hook
        // used to intercept. The site has since changed that flow, so the hook no longer fires and
        // `CreateImageLinks` times out. Primary path: scroll the rendered reader in a visible window
        // and collect the real image CDN URLs (c*.japscan.foo) from `<img>` and the resource timeline.
        let pages = await this.#ExtractPagesFromReader(referer);
        if (!pages.length) {
            await this.#Log('JapScan: reader extraction empty, trying DRM hook');
            try {
                pages = await this.#drm.CreateImageLinks(chapterURL);
            } catch (error) {
                await this.#Log(`JapScan: DRM hook failed: ${(error as Error)?.message ?? error}`);
            }
        }
        await this.#Log(`JapScan: FetchPages -> ${pages.length} pages :: ${pages.slice(0, 5).join(' | ')}`);
        return pages.map(link => new Page(this, chapter, new URL(link), { Referer: referer }));
    }

    // Scrolls the visible reader to trigger lazy-loading, then collects every image URL whose host
    // is the JapScan image CDN (c*.japscan.foo). The script is fully wrapped so it can never reject
    // `ExecuteScript` with "Script failed to execute".
    async #ExtractPagesFromReader(referer: string): Promise<string[]> {
        const script = `
            (() => {
                const IMG_RE = /\.(jpe?g|png|webp|gif|avif|bmp|tiff?)(?:[?#]|$)/i;
                const isCDN = u => typeof u === 'string' && u.length > 0 && u.indexOf('.japscan.foo') !== -1 && u.indexOf('www.japscan.foo') === -1 && IMG_RE.test(u);
                const seen = new Set();
                const collect = () => {
                    try {
                        document.querySelectorAll('img').forEach(img => {
                            [img.currentSrc, img.src, img.getAttribute('data-src'), img.getAttribute('data-original'), img.getAttribute('data-lazy-src')].forEach(u => {
                                if (isCDN(u)) seen.add(u);
                            });
                        });
                    } catch (e) {}
                    try {
                        performance.getEntriesByType('resource').forEach(entry => {
                            if (entry && isCDN(entry.name)) seen.add(entry.name);
                        });
                    } catch (e) {}
                };
                collect();
                return new Promise(resolve => {
                    let steps = 0;
                    const step = () => {
                        collect();
                        try { window.scrollBy(0, window.innerHeight || 800); } catch (e) {}
                        const atBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 30);
                        if (atBottom || ++steps >= 80) {
                            collect();
                            resolve(Array.from(seen));
                        } else {
                            setTimeout(step, 250);
                        }
                    };
                    setTimeout(step, 300);
                });
            })()
        `;
        try {
            const pages = await FetchWindowScript<string[]>(new Request(referer), script, 1000, 150000, true);
            return (pages ?? []).filter((link, index, all) => all.indexOf(link) === index);
        } catch (error) {
            await this.#Log(`JapScan: reader extraction failed: ${(error as Error)?.message ?? error}`);
            return [];
        }
    }

    async #Log(message: string): Promise<void> {
        try {
            await GetIPC().Send(DiagnosticsChannels.App.WriteLog, message);
        } catch (error) {
            console.warn('JapScan: diagnostics failed', error);
        }
    }
}
