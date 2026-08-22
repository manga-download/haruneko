import { Tags } from '../Tags';
import icon from './KuroToon.webp';
import { type Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { FetchCSS, FetchHTML } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

const queryMangas = 'a.block.relative.rounded-xl[href*="/comic/"]';
const chaptersScript = `new Promise(resolve => {
    const collect = () => [...document.querySelectorAll('a.group.flex-grow[href*="/read/"]')]
        .map(anchor => ({ id: anchor.pathname, title: anchor.innerText.trim() }));
    const button = [...document.querySelectorAll('button')].find(button => button.textContent.includes('ดูตอนทั้งหมด'));
    const remaining = Number(button?.textContent.match(/(\\d+)\\s*ตอนที่เหลือ/)?.[1] || 0);
    const expected = collect().length + remaining;
    button?.click();
    let attempts = 0;
    const timer = setInterval(() => {
        const chapters = collect();
        if (chapters.length >= expected || attempts++ >= 40) {
            clearInterval(timer);
            resolve(chapters);
        }
    }, 250);
});`;

function ExtractManga(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLImageElement>('img[alt]')?.alt.trim() || anchor.innerText.trim()
    };
}

@Common.MangaCSS(/^{origin}\/comic\/[^/]+\/?$/, 'h1')
@Common.ChaptersSinglePageJS(chaptersScript, 500)
@Common.ImageElement(true, true)
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('kurotoon', 'KuroToon', 'https://kurotoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const first = await FetchHTML(new Request(new URL('/search/?page=1', this.URI)));
        const lastPage = Math.max(1, ...[...first.querySelectorAll<HTMLAnchorElement>('a[href*="page="]')]
            .map(anchor => Number(new URL(anchor.href, this.URI).searchParams.get('page')) || 1));
        const documents = [first];
        const pages = Array.from({ length: lastPage - 1 }, (_, index) => index + 2);
        const batchSize = 8;
        for (let index = 0; index < pages.length; index += batchSize) {
            const batch = pages.slice(index, index + batchSize);
            documents.push(...await Promise.all(batch.map(page => FetchHTML(new Request(new URL(`/search/?page=${page}`, this.URI))))));
        }
        return documents.flatMap(document => [...document.querySelectorAll<HTMLAnchorElement>(queryMangas)].map(anchor => {
            const { id, title } = ExtractManga(anchor);
            return new Manga(this, provider, id, title);
        })).distinct();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(chapter.Identifier, this.URI);
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(uri, {
            headers: { Referer: new URL(chapter.Parent.Identifier, this.URI).href }
        }), 'script:not([src])');
        const payload = scripts.map(script => script.text).find(script => script.includes('images:['));
        const images = payload?.match(/images:(\[[^\]]+\])/s)?.at(1);
        if (!images) return [];
        return (JSON.parse(images) as string[]).map(link => new Page(this, chapter, new URL(link), { Referer: uri.href }));
    }
}
