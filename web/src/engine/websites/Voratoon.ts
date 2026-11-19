import { Tags } from '../Tags';
import icon from './Voratoon.webp';
import { type Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { FetchNextJS, FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

type HydratedManga = {
    initialData: {
        series: {
            id: number;
            data: {
                title: string;
                slug: string;
            };
        }[];
    };
};

AddAntiScrapingDetection(async invoke => invoke(`
    new Promise((resolve, reject) => {

        if (window.location.hash) {
            return resolve(${FetchRedirection.None});
        }

        //if the cookie is set, cloudflare wont be loaded
        setTimeout( () => {
            return resolve(${FetchRedirection.None});
        }, 3000);

        const observer = new MutationObserver((mutations, obs) => {
            for (const mutation of mutations) {
                // Check added nodes
                for (const node of mutation.addedNodes) {
                    if (node.tagName === 'SCRIPT') {
                        const src = node.src || '';

                        // Check if the script belongs to Cloudflare
                        if (src.includes('cloudflare.com') || src.includes('challenges.cloudflare.com')) {
                            node.addEventListener('load', onCloudflareLoaded);
                            node.onerror = reject;
                            obs.disconnect();
                        }
                    }
                }
            }
        });

        // Start observing the document body (or head) for added child nodes
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });

        let origBeforeinteractivecallback;
        let origCallback;

        function onCloudflareLoaded(event) {
            event.target.removeEventListener('load', onCloudflareLoaded);
            turnstile.render = new Proxy(turnstile.render, {

                apply(target, thisArg, argumentsList) {
                    const [element, options] = argumentsList;

                    origBeforeinteractivecallback = options["before-interactive-callback"];
                    origCallback = options.callback;

                    options["before-interactive-callback"] = () => handleTurnstileEvent('interactive');
                    options['callback'] = (token) => handleTurnstileEvent('success', token);

                    return Reflect.apply(target, thisArg, argumentsList);
                }

            });
        }

        function handleTurnstileEvent(eventType, tokenOrError, formName) {
            let token = tokenOrError;
            switch (eventType) {
                case 'success':
                    window.location.hash = token;
                    origCallback(token);
                    setTimeout(() => window.location.reload(), 1500);
                    return resolve(${FetchRedirection.Automatic});
                    break;
                case 'interactive':
                    origBeforeinteractivecallback(token, formName);
                    return resolve(${FetchRedirection.Interactive});
                    break;
            }
        }
    });

`), /^https:\/\/\d+\.voratoon\.com\/series\/[^/]+\/chapter\/\d+/);

@Common.ChaptersSinglePageJS(`[...document.querySelectorAll('ul.chapter-list li a.chapter-item')].map(link => ({id: link.pathname, title: link.querySelector('.chapter-title').textContent.trim()}));`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikcast', 'Voratoon', 'https://13.voratoon.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { initialData: { series } } = await FetchNextJS<HydratedManga>(new Request(new URL(url)), data => 'initialData' in data);
        return new Manga(this, provider, new URL(url).pathname, series[0].data.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { initialData: { series } } = await FetchNextJS<HydratedManga>(new Request(new URL(`/browse?page=${page}`, this.URI)), data => 'initialData' in data);
                const mangas = series.map(({ data: { title, slug } }) => new Manga(this, provider, `/series/${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(chapter.Identifier, this.URI);

        //let the user fill captcha if needed. Catcha role is just to set a cookie.
        await FetchWindowScript(new Request(chapterUrl), ``);

        const images = await FetchWindowScript<string[]>(new Request(chapterUrl), `[...document.querySelectorAll('img[data-chapter-page]')].map(img => img.src)`, 3000);
        return images.map(image => new Page(this, chapter, new URL(image, this.URI), { Referer: this.URI.href }));

    }
}