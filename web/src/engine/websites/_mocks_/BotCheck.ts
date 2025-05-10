import { Tags } from '../../Tags';
import { FetchWindowScript } from '../../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

const botchecks = [
    {
        url: 'https://cloudflare.bot-check.ovh/automatic',
        title: 'Cloudflare: JavaScript Challenge',
        script: `
            document.querySelector('#hash')?.innerText === '801BE7B2C3621A7DE738CF77BD4EF264';
        `,
    },
    {
        url: 'https://cloudflare.bot-check.ovh/interactive',
        title: 'Cloudflare: Legacy Captcha',
        script: `
            document.querySelector('#hash')?.innerText === '47BBDCA5E4BDC94EFCDB730C05ACABE9';
        `,
    },
    {
        url: 'https://cloudflare.bot-check.ovh/managed',
        title: 'Cloudflare: Managed Challenge',
        script: `
            document.querySelector('#hash')?.innerText === 'FA4167CE91A8FD8416BD9B2659363CB4';
        `,
    },
    {
        url: 'https://cloudflare.bot-check.ovh/turnstile-managed',
        title: 'Cloudflare: Turnstile API (Managed)',
        script: `
            new Promise(resolve => {
                setTimeout(() => resolve(false), 2500);
                setInterval(() => document.querySelector('#hash')?.innerText === 'A9B6FA3DD8842CD8E2D6070784D92434' ? resolve(true) : console.log('-'), 250);
            });
        `,
    },
    {
        url: 'https://cloudflare.bot-check.ovh/turnstile-automatic',
        title: 'Cloudflare: Turnstile API (Non-Interactive)',
        script: `
            new Promise(resolve => {
                setTimeout(() => resolve(false), 2500);
                setInterval(() => document.querySelector('#hash')?.innerText === 'A9B6FA3DD8842CD8E2D6070784D92434' ? resolve(true) : console.log('-'), 250);
            });
        `,
    },
    {
        url: 'https://cloudflare.bot-check.ovh/turnstile-invisible',
        title: 'Cloudflare: Turnstile API (Invisible)',
        script: `
            new Promise(resolve => {
                setTimeout(() => resolve(false), 2500);
                setInterval(() => document.querySelector('#hash')?.innerText === 'A9B6FA3DD8842CD8E2D6070784D92434' ? resolve(true) : console.log('-'), 250);
            });
        `,
    },
];

/**
 * Sample Website Implementation for Developer Testing
 */
@Common.PagesSinglePageCSS('x')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bot-check', '🔷 Bot-Check 🔷', 'https://cloudflare.bot-check.ovh', Tags.Media.Manga, Tags.Source.Official, Tags.Language.Multilingual);
    }

    public override ValidateMangaURL(url: string): boolean {
        return botchecks.some(entry => url.startsWith(entry.url));
    }

    public async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const entry = botchecks.find(entry => url.startsWith(entry.url));
        return new Manga(this, provider, entry.url, entry.title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return botchecks.map(entry => new Manga(this, provider, entry.url, entry.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        await fetch(new URL('/reset', this.URI));
        const entry = botchecks.find(entry => entry.url === manga.Identifier);
        const bypassed = await FetchWindowScript<boolean>(new Request(entry.url), entry.script);
        return [
            new Chapter(this, manga, manga.Identifier, bypassed ? '✅ SUCCESS' : '❌ FAILED'),
        ];
    }
}