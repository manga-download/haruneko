import { Tags } from '../Tags';
import icon from './Alphapolis.webp';
import { type Chapter, DecoratableMangaScraper, Page, type MangaPlugin, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Grouple from './decorators/Grouple';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

type APIPages = {
    page: {
        images: {
            url: string;
        }[]
    }
};

const tokenScript = `
    new Promise(resolve => {
        window.cookieStore.get('XSRF-TOKEN')
            .then(cookie => !cookie ? resolve(cookie) : resolve(decodeURIComponent(cookie.value))) ;
    });
`;

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<boolean>(`document.documentElement.innerHTML.includes('window.awsWafCookieDomainList')`);
    return result ? FetchRedirection.Automatic : undefined;
});

function ChaptersExtractor(element: HTMLElement) {
    const id = element instanceof HTMLAnchorElement ? element.pathname : element.querySelector<HTMLAnchorElement>('a.read-episode').pathname;
    const title = element.querySelector('.title').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/manga\/(official|\d+)\/\d+/, 'div.manga-detail-description > div.title, div.content-main > h1.title')
@Common.ChaptersSinglePageCSS('div.episode-unit, div.episodes div.episode a', undefined, ChaptersExtractor)
@Grouple.ImageWithMirrors()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('alphapolis', `ALPHAPOLIS (アルファポリス)`, 'https://www.alphapolis.co.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const results: Manga[] = [];
        for (const character of '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')) {
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, 'div.mangas-list div.wrap div.title a', Common.PatternLinkGenerator(`/search?category=official_manga&query=${character}&page={page}`), 500);
            results.push(...mangas);
        }
        results.push(...await Common.FetchMangasMultiPageCSS.call(this, provider, 'div.content-main div.content-title a', Common.PatternLinkGenerator('/manga/index?sort=title&limit=1000&page={page}'), 500));
        return results.distinct();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const token = await FetchWindowScript<string>(new Request(this.URI), tokenScript, 500);
        const fullHdImages = await this.GetImagesLinks(chapter, token);
        const fallbackImages = await this.GetImagesLinks(chapter, token, 'standard');
        return fullHdImages.map((image, index) => new Page(this, chapter, new URL(image), { mirrors: [fallbackImages[index]] }));
    }

    private async GetImagesLinks(chapter: Chapter, token: string, quality: string = 'full_hd'): Promise<string[]> {
        let endpoint = new URL('./manga/official/viewer.json', this.URI);
        let [mangaId, chapterId] = chapter.Identifier.split('/').slice(-2);
        const body = {
            episode_no: null,
            hide_page: false,
            manga_sele_id: null,
            preview: false,
            resolution: quality
        };

        if (!/\/official\//.test(chapter.Identifier)) {
            // /manga/?????/<mangaId>/episode/<episodeId>
            endpoint = new URL(chapter.Identifier + '/viewer.json', this.URI);
            [mangaId, , chapterId] = chapter.Identifier.split('/').slice(-3);
            body['data'] = null;
        }

        body.episode_no = parseInt(chapterId);
        body.manga_sele_id = parseInt(mangaId);

        const { page: { images } } = await FetchJSON<APIPages>(new Request(endpoint, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-XSRF-TOKEN': token
            },
            body: JSON.stringify(body),
        }));
        return images.map(image => image.url);
    }
}