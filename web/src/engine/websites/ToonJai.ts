import { Tags } from '../Tags';
import icon from './ToonJai.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchNextJS } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type HydratedEpisode = { no: number | string; name: string; };
type HydratedContent = { id: string; name: string; slug: string; episodes: HydratedEpisode[]; };

const pagesScript = `new Promise(resolve => {
    const accept = [...document.querySelectorAll('button')].find(button => button.textContent.includes('อายุ 18 ปีขึ้นไป'));
    accept?.click();
    let previous = -1;
    let stable = 0;
    let attempts = 0;
    const timer = setInterval(() => {
        const images = [...document.images].map(image => image.currentSrc || image.src).filter(link => link.includes('/content/'));
        stable = images.length > 0 && images.length === previous ? stable + 1 : 0;
        previous = images.length;
        if(stable >= 2 || attempts++ >= 20) {
            clearInterval(timer);
            resolve(images);
        }
    }, 500);
});`;

function ExtractManga(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLElement>('h3')?.innerText.trim() || anchor.innerText.trim()
    };
}

@Common.PagesSinglePageJS(pagesScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('toonjai', 'ToonJai', 'https://toonjai.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/content/[^/]+/?$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = new URL(url).pathname.split('/').at(-1);
        const content = await this.#FetchContent(slug);
        return new Manga(this, provider, `/content/${content.slug}`, content.name);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await Common.FetchMangasSinglePageCSS.call(this, provider, '/', 'a.group.block[href*="/content/"]', ExtractManga);
        return mangas.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const slug = manga.Identifier.split('/').at(-1);
        const { episodes } = await this.#FetchContent(slug);
        return [...episodes].reverse().map(({ no, name }) => new Chapter(this, manga, `/content/${slug}/episode/${no}`, `ตอนที่ ${no}${name ? ` ${name}` : ''}`));
    }

    async #FetchContent(slug: string): Promise<HydratedContent> {
        const data = await FetchNextJS<HydratedContent>(new Request(new URL(`/content/${slug}`, this.URI)), data => 'slug' in data && data.slug === slug && 'episodes' in data);
        if(!data?.episodes) {
            throw new Error('Failed to extract content data!');
        }
        return data;
    }
}
