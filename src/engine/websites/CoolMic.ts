import { Tags } from '../Tags';
import icon from './CoolMic.webp';
import type { MangaPlugin } from '../providers/MangaPlugin';
import { Chapter, DecoratableMangaScraper, Page, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

type APIMangas = {
    hits: {
        hit: {
            id: number,
            fields: {
                title_name : string
            }
        }[]
    }
}

type JsonChapters = {
    episodes: {
        id: number,
        number : string
    }[]
}

type APIPages = {
    image_data?: {
        path: string
    }[],
    signed_cookie?: CookieSigner
}

type CookieSigner = {
    'CloudFront-Policy': string,
    'CloudFront-Signature': string,
    'CloudFront-Key-Pair-Id': string
}

@Common.MangaCSS(/^{origin}\/titles\/\d+$/, 'meta[property="og:title"]')
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = `${this.URI.origin}/api/v1/`;
    private readonly languageCode : string = 'en';

    public constructor(id = 'coolmic', label = 'CoolMic', url = 'https://coolmic.me', tags = [Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.English, Tags.Source.Official]) {
        super(id, label, url, ...tags);
        this.languageCode = this.URI.href.match(/https:\/\/([a-z]+)\.coolmic/)?.at(-1) ?? this.languageCode;
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const token = (await FetchCSS<HTMLMetaElement>(new Request(this.URI), 'meta[name="csrf-token"]')).at(0).content;
        const promises = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(character => {
            const url = new URL(`https://${this.languageCode}-search.coolmic.me/search`);
            const params = new URLSearchParams({
                q: `(${character}|*${character})`,
                size: '10000',
                start: '0',
                'q.parser': 'simple',
                return: '_all_fields',
                sort: '_score desc, like_vote_count desc',
                fq: ''
            });

            url.search = params.toString();
            const request = new Request(url, {
                headers: {
                    'x-csrf-token': token,
                    'x-requested-with': 'XMLHttpRequest'
                }
            });

            return FetchJSON<APIMangas>(request);
        });

        const results = (await Promise.all(promises)).reduce((accumulator: Manga[], element) => {
            const mangas = element.hits.hit.map(manga => new Manga(this, provider, `/titles/${manga.id}`, manga.fields.title_name.trim()));
            accumulator.push(...mangas);
            return accumulator;
        }, []);

        return results.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [jsonNode] = await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), '[\\:page-objects]');
        const { episodes } = JSON.parse(jsonNode.getAttribute(':page-objects')) as JsonChapters;
        return episodes.map(episode => new Chapter(this, manga, episode.id.toString(), episode.number.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(`/api/v1/viewer/episodes/${chapter.Identifier}`, this.apiUrl));
        const { image_data, signed_cookie } = await FetchJSON<APIPages>(request);
        if (!signed_cookie) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        return image_data.map(page => new Page<CookieSigner>(this, chapter, new URL(page.path), { ...signed_cookie }));
    }

    public override async FetchImage(page: Page<CookieSigner>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {

            const cookiesData = page.Parameters;
            const cookies = Object.keys(cookiesData).map(name => `${name}=${cookiesData[name]}`).join(';');

            const request = new Request(page.Link, {
                signal: signal,
                headers: {
                    Cookie: cookies,
                    Referer: page.Link.origin,
                }
            });

            const response = await Fetch(request);
            return response.blob();
        }, priority, signal);
    }
}