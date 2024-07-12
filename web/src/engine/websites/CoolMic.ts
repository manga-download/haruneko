import { Tags } from '../Tags';
import icon from './CoolMic.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

const chaptersScript = `
    new Promise( resolve =>{
        resolve(JSON.parse(document.querySelector('title-page').getAttribute(':page-objects')).episodes.map(episode => {
            return {
                id: episode.id.toString(),
                title : episode.number.toString()
            };
        }));
    });
`;

type APIPages = {
    image_data: {
        path: string
    }[],
    signed_cookie: CookieSigner
}

type CookieSigner = {
    'CloudFront-Policy': string,
    'CloudFront-Signature': string,
    'CloudFront-Key-Pair-Id': string
}

@Common.MangaCSS(/^{origin}\/titles\/\d+$/, 'meta[property="og:title"]')
@Common.MangasNotSupported()
@Common.ChaptersSinglePageJS(chaptersScript)

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/api/v1/`;

    public constructor() {
        super('coolmic', 'CoolMic', 'https://coolmic.me', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.English, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(`/api/v1/viewer/episodes/${chapter.Identifier}`, this.apiUrl));
        const { image_data, signed_cookie } = await FetchJSON<APIPages>(request);
        if (!image_data || !signed_cookie) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        return image_data.map(page => new Page(this, chapter, new URL(page.path), { ...signed_cookie }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {

            const cookiesData = page.Parameters as CookieSigner;
            const cookies: string[] = [];
            Object.keys(cookiesData).forEach(name => {
                const value = cookiesData[name];
                cookies.push(`${name}=${value}`);
            });

            const request = new Request(page.Link, {
                signal: signal,
                headers: {
                    Cookie: cookies.join(';'),
                    Referer: page.Link.origin,
                }
            });

            const response = await Fetch(request);
            return response.blob();
        }, priority, signal);
    }
}