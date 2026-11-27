import { Tags } from '../Tags';
import icon from './MadaraDex.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { AddAntiScrapingDetection } from '../platform/AntiScrapingDetection';
import { RateLimit } from '../taskpool/RateLimit';

AddAntiScrapingDetection(async invoke => invoke(`
    new Promise(async (resolve, reject) => {

        async function request(claim, challenge = '', token = '') {
            const { refreshUrl } = window.mdxImageProtection;
            const response = await fetch(refreshUrl, {
                credentials: 'include',
                method: 'POST',
                body: new URLSearchParams({ action: 'mdx_image_auth_refresh', chapter_claim: claim, chapter_challenge: challenge, 'cf-turnstile-response': token, manual_verification: '0' }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            })
            const data = await response.json();
            return data;
        }

        function RenderCaptcha(sitekey, challenge, claim) {
            document.head.replaceChildren();
            document.body.innerHTML = '<div id="cf-turnstile" style="display: grid; height: 100vh; place-items: center;"></div>';
            const script = document.createElement('script');
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
            script.onerror = reject;
            script.onload = () => window.turnstile.render('#cf-turnstile', {
                action: window.mdxImageProtection.action,
                sitekey: sitekey,
                cData: challenge,
                callback: async token => {
                    debugger;
                    await request(claim, challenge, token);
                    resolve(1);
                    setTimeout(() => window.location.reload(), 500);
                },
                'before-interactive-callback': () => resolve(2),
            });
            document.head.appendChild(script);
        }

        try {
            const images = [...document.querySelectorAll('div.page-break img')];
            const claims = [...new Set([...images].map(img => img.getAttribute('data-mdx-chapter-claim')))];
            if (claims.length > 1) return reject('more than one claim');
            const answer = await request(claims[0]);
            if (answer.success) return resolve(0)
            else RenderCaptcha(window.mdxImageProtection.siteKey, answer.data.challenge, claims[0]);

        } catch (e) {
            reject(e)
        }
    });


`), /^https:\/\/madaradex\.org\/title\/[^/]+\/[^/]+/);

@Common.MangaCSS(/^{origin}\/title\/[^/]+\/$/, 'meta[property="og:title"]')
@Common.MangasMultiPageCSS('article div.mdxr-card-copy h3 a', Common.PatternLinkGenerator('/all/?mdxr_page={page}'))
@Common.ChaptersMultiPageCSS<HTMLAnchorElement>('li.wp-manga-chapter a', Common.PatternLinkGenerator('{id}?mdxr_chapter_page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('span.mdxr-chapter-name').textContent.trim(),
}))

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('madaradex', 'MadaraDex', 'https://madaradex.org', Tags.Media.Manhwa, Tags.Language.English, Tags.Rating.Pornographic, Tags.Source.Aggregator);
        //this.imageTaskPool.RateLimit = new RateLimit(2, 1);
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `cookieStore.set('mdxr_age_v1', '1')`);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images = await FetchWindowScript<string[]>(new Request(new URL(chapter.Identifier, this.URI)), `[...document.querySelectorAll('div.page-break img')].map(img => img.dataset.mdxProtectedSrc ?? img.src);`);
        return images.map(src => new Page(this, chapter, new URL(src), { Referer: this.URI.href }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link, {
                credentials: 'include',
                signal, headers: {
                    Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                    Referer: page.Parameters.Referer,
                    'Sec-Fetch-Dest': 'image',
                    'Sec-Fetch-Mode': 'no-cors',
                    'Sec-Fetch-Site': 'same-site',
                }
            }));
            return response.blob();
        }, priority, signal);
    };
}