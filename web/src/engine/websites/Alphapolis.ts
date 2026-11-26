import { Tags } from '../Tags';
import icon from './Alphapolis.webp';
import { type Chapter, DecoratableMangaScraper, Page, type MangaPlugin, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { GetBase64FromBytes } from '../BufferEncoder';
import * as AlphaViewer from './decorators/AlphaViewer';
import { AddAlphaAntiScraping, ExtractKeys, type PageData } from './decorators/AlphaViewer';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type APIPages = {
    page: {
        images: {
            url: string;
        }[];
        placeholder?: string;
    };
};

type ImagesData = {
    images: string[];
    keys: Uint8Array<ArrayBuffer>[];
};

AddAlphaAntiScraping(/https:\/\/(?:www\.)?alphapolis\.co\.jp/);

@Common.MangaCSS(/^{origin}\/manga\/(official|\d+)\/\d+$/, 'div#breadcrumbs span:last-of-type')
@Common.ChaptersSinglePageJS(`
    new Promise(resolve => {
        resolve(
            [...document.querySelectorAll('li.episode-unit, a.p-table-of-contents__episode-link')].map(chapter => {
                const id = chapter instanceof HTMLAnchorElement ? chapter.pathname : chapter.querySelector('a.read-episode').pathname;
                const title = chapter.querySelector('.title, .p-table-of-contents__episode-title').textContent.trim();
                return { id, title };
            })
        );
    });
`, 750)
@AlphaViewer.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('alphapolis', 'ALPHAPOLIS (アルファポリス)', 'https://www.alphapolis.co.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
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

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const token = await FetchWindowScript<string>(new Request(this.URI), `cookieStore.get('XSRF-TOKEN').then(({ value }) => decodeURIComponent( value ) ?? null).catch(error => null);`, 500);
        const fullHdImages = await this.GetImagesLinks(chapter, token);
        const fallbackImages = await this.GetImagesLinks(chapter, token, 'standard');

        const source = fullHdImages ?? fallbackImages;
        if (!source || !source.images) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        const { images, keys } = source;
        return images.map((image, index) => new Page<PageData>(this, chapter, new URL(image), { key: keys ? GetBase64FromBytes(keys[index]): null }));
    }

    private async GetImagesLinks(chapter: Chapter, token: string, quality: string = 'full_hd'): Promise<ImagesData | null> {
        try {

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

            const { page: { images, placeholder } } = await FetchJSON<APIPages>(new Request(endpoint, {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-XSRF-TOKEN': token
                },
                body: JSON.stringify(body),
            }));

            return {
                images: images.map(({ url }) => url),
                keys: placeholder ? ExtractKeys(placeholder) : null
            };
        } catch {
            return null;
        }
    }

}