import { Tags } from '../Tags';
import icon from './CrunchyScan.webp';
import type { Priority } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';
import { DecoratableMangaScraper, type Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';
import { AddStalledChallengeReload } from '../platform/ChallengeReload';
import { FetchWindowScript } from '../platform/FetchProvider';
import { Delay, SetTimeout, ClearTimeout } from '../BackgroundTimers';

import { DRMProvider } from './CrunchyScan.DRM';

// Affiche la fenêtre navigateur quand Cloudflare présente son challenge
// (page « Un instant… » / « Vérifiez que vous êtes humain »).
AddAntiScrapingDetection(async invoke => {
    const challenged = await invoke<boolean>(`
        (() => {
            const title = (document.title || '').trim().toLowerCase();
            const text = (document.body?.innerText || '').toLowerCase();
            return /just a moment|un instant|checking your browser/i.test(title)
                || /vérification de sécurité|verify you(?:'re| are)? human|vérifiez que vous êtes humain|checking if the site connection is secure/i.test(text);
        })()
    `);
    return challenged ? FetchRedirection.Interactive : undefined;
}, /^https:\/\/(?:www\.)?crunchyscan\.org/);

// Opt-in pour le reload automatique des challenges Cloudflare « managés » sans widget
// (la page garde un cf_clearance valide mais ne redirige jamais). C'est le seul site
// dont on recharge la page pour obtenir le contenu réel.
AddStalledChallengeReload(/^https:\/\/(?:www\.)?crunchyscan\.org/);

function CleanTitle(text: string) {
    return text.replace(/^\s*\(\s*adulte[^\)]*\)\s*/i, '');
}

function MangaLinkExtractor(head: HTMLHeadingElement, uri: URL) {
    return {
        id: uri.pathname,
        title: CleanTitle(head.innerText),
    };
}

@Common.MangaCSS(/^{origin}\/lecture-en-ligne\/[^/]+$/, 'main.container .baseManga h2', MangaLinkExtractor)
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a[class*="text"][href*="/lecture-en-ligne/"]', Common.PatternLinkGenerator('/api/getLastManga?method=grid&page={page}'), 0, a => ({ id: a.pathname, title: CleanTitle(a.text) }))
@Common.ChaptersSinglePageCSS('#ChapterWrap a.chapter-link[href*="/read/"]')
export default class extends DecoratableMangaScraper {

    readonly #drm = new DRMProvider();

    // Le fonctionnement normal de CrunchyScan passe par une vraie fenêtre
    // navigateur (challenge Cloudflare interactif) — la vérification silencieuse
    // du nouveau contenu saute donc ce site (réglage check-new-content-silent).
    public override readonly RequiresVisibleBrowserWindow = true;

    public constructor() {
        super('crunchyscan', 'Crunchyscan', 'https://crunchyscan.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Aggregator);
        this.imageTaskPool.RateLimit = new RateLimit(2, 1);
    }

    public override async Initialize(): Promise<void> {
        // Ouvre une fenêtre navigateur sur la racine pour déclencher le challenge
        // Cloudflare et conserver le cookie cf_clearance dans la session partagée.
        await FetchWindowScript(new Request(this.URI.href), '');
    }

    public override get Icon(): string {
        return icon;
    }

    public async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await this.#drm.CreateImageLinks(new URL(chapter.Identifier, this.URI));
        return data.map(image => new Page(this, chapter, new URL(image.url, this.URI), { Referer: image.referer }));
    }

    public async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            // Cloudflare peut challenger ou faire traîner une requête image de façon
            // intermittente (403 / connexion figée) → timeout par tentative + 3 essais.
            let lastError: unknown;
            for (let attempt = 0; attempt < 3; attempt++) {
                if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
                const attemptSignal = new AbortController();
                const onAbort = () => attemptSignal.abort();
                signal.addEventListener('abort', onAbort, { once: true });
                const timeout = await SetTimeout(() => attemptSignal.abort(), 30_000);
                try {
                    return await this.#drm.GetImageData(page.Link, page.Parameters.Referer, attemptSignal.signal);
                } catch (error) {
                    if (signal.aborted) throw error;
                    lastError = error;
                } finally {
                    ClearTimeout(timeout);
                    signal.removeEventListener('abort', onAbort);
                }
                await Delay(1000 * (attempt + 1));
            }
            throw lastError instanceof Error ? lastError : new Error(String(lastError));
        }, priority, signal);
    }
}