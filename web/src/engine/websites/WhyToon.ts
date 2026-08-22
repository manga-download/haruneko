import { Tags } from '../Tags';
import icon from './WhyToon.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { FetchHTML, FetchNextJS } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type HydratedEpisode = { no: number | string; name: string; };
type HydratedContent = { id: string; name: string; slug: string; episodes: HydratedEpisode[]; };
type HydratedPages = { images: string[]; };

function ExtractManga(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLElement>('h3')?.innerText.trim() || anchor.querySelector<HTMLImageElement>('img[alt]')?.alt.trim() || anchor.innerText.trim()
    };
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('whytoon', 'WhyToon', 'https://whytoon.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/content/[^/]+/?$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = new URL(url).pathname.split('/').at(-1);
        const data = await FetchHTML(new Request(url));
        const title = data.querySelector('title')?.textContent.replace(/\s*\|\s*WhyToon\s*$/, '').trim();
        if(!slug || !title) {
            throw new Error('Failed to extract manga data!');
        }
        return new Manga(this, provider, `/content/${slug}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await Common.FetchMangasSinglePageCSS.call(this, provider, '/', 'a.block.group[href*="/content/"]', ExtractManga);
        return mangas.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const slug = manga.Identifier.split('/').at(-1);
        const { episodes } = await this.#FetchEpisodes(slug);
        return [...episodes].reverse().map(({ no, name }) => new Chapter(this, manga, `/content/${slug}/${no}`, `ตอนที่ ${no}${name ? ` ${name}` : ''}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'images' in data && Array.isArray(data.images));
        if(!data?.images.length) {
            throw new Error('Failed to extract chapter images!');
        }
        const referer = new URL(chapter.Identifier, this.URI).href;
        return data.images.map(image => new Page(this, chapter, new URL(image, 'https://gd.whytoon.com/'), { Referer: referer }));
    }

    async #FetchEpisodes(slug: string): Promise<Pick<HydratedContent, 'episodes'>> {
        const data = await FetchNextJS<Pick<HydratedContent, 'episodes'>>(new Request(new URL(`/content/${slug}`, this.URI)), data => 'episodes' in data && Array.isArray(data.episodes) && data.episodes.length > 2);
        if(!data?.episodes) {
            throw new Error('Failed to extract content data!');
        }
        return data;
    }
}
