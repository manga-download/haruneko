import { Tags } from '../Tags';
import icon from './RaijinScans.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import { GetBytesFromURLBase64, GetUTF8FromBytes } from '../BufferEncoder';

type ReaderManifest = {
    m: string;
    c: JSONElement;
};

type ReaderData = {
    manifestArray: ReaderManifest[];
    rjfrValue: string;
};

type DecryptedConfig = {
    d: Array<JSONElement>;
    l: number[];
    m: number[];
};

type ImagesData = {
    images: JSONArray;
    payload: JSONArray;
};

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.serie-info h1.serie-title')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('raijinscans', 'RaijinScans', 'https://raijin-scans.fr', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(new URL('manga/-/', this.URI)), '');
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { manifestArray, rjfrValue } = await FetchWindowScript<ReaderData>(new Request(new URL(chapter.Identifier, this.URI)), `
            new Promise((resolve) => {
                function findManifestArrayOnWindow() {
                    const targetKey = Object.keys(window).find(key => {
                        if (!key.startsWith('rjfr_')) return false;
                        const firstElement = window[key]?.[0];
                        return firstElement && typeof firstElement === 'object' && firstElement.c && firstElement.m;
                    });
                    return targetKey ? window[targetKey] : null;
                }

                resolve({
                    manifestArray: findManifestArrayOnWindow(),
                    rjfrValue: document.querySelector('[data-rj-free-reader-root]')?.getAttribute('data-rj-free-reader-root') || ''
                });
            });
        `, 1500);
        if (!manifestArray) throw new Exception(R.Plugin_Common_Chapter_UnavailableError);

        const pages = await manifestArray.reduce<Promise<Page[]>>(async (accP, manifest) => {
            const acc = await accP;

            const { m, c } = manifest;
            const config = <DecryptedConfig>JSON.parse(GetUTF8FromBytes(GetBytesFromURLBase64(m.split('|').map(k => c[k]).join(''))));

            const { d: shuffled, m: perm, l: order } = config;
            const ordered = new Array<JSONElement>(shuffled.length);
            perm.forEach((p, i) => { ordered[p] = shuffled[i]; });

            const values = order.map(o => ordered[o]);
            const action = <string>values.find(v => typeof v === 'string' && v.startsWith('rjfr_'));
            const keyArr = <string[]>values[13];
            const contentValues = values.slice(1, 7);

            const manifestImages: Page[] = [];
            let cursor = '';

            for (let run = true, limit = 0; run; limit++) {
                const form = new FormData();
                form.set('action', action);

                contentValues.forEach((v, j) => form.set(keyArr[j], String(v)));
                form.set(keyArr[6], String(manifestImages.length));
                form.set(keyArr[7], '0');
                form.set(keyArr[8], rjfrValue);
                form.set(keyArr[9], cursor);

                const responseData = await FetchJSON(new Request(new URL('/wp-admin/admin-ajax.php', this.URI), {
                    credentials: 'same-origin',
                    method: 'POST',
                    body: form,
                }));

                const { images, payload } = <ImagesData>this.FindImages(responseData);
                if (!images) break;

                const newPages: string[] = images.map(this.ImageUrlOrNull).filter(Boolean);
                newPages.forEach(page => {
                    manifestImages.push(new Page(this, chapter, new URL(page, this.URI), { Referer: this.URI.href }));
                });

                const payloadValues = Object.values(payload);
                cursor = payloadValues.find(x => typeof x === 'string' && /^\d+\.\d+\.[0-9a-f]{64}$/.test(x)) as string || '';
                run = cursor !== '' && payloadValues.includes(true) && limit < 5;
            }
            return [...acc, ...manifestImages];
        }, Promise.resolve([]));

        return pages;
    }

    private FindImages(el: JSONElement): JSONElement {
        if (!el || typeof el !== 'object') return null;

        if (!Array.isArray(el)) {
            const targetKey = Object.keys(el).find(key => this.IsImageArray(el[key]));
            if (targetKey) return { payload: el, images: el[targetKey] };

            for (const key of Object.keys(el)) {
                const result = this.FindImages(el[key]);
                if (result) return result;
            }
        } else {
            for (const item of el) {
                const result = this.FindImages(item);
                if (result) return result;
            }
        }
        return null;
    }

    private IsImageArray(arr: JSONElement): boolean {
        return Array.isArray(arr) && arr.length > 0 && this.ImageUrlOrNull(arr[0]) !== null;
    }

    private ImageUrlOrNull(obj: JSONElement): string | null {
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
        const targetValue = Object.values(obj).find(
            v => typeof v === 'string' && v.startsWith('http') && /\.(webp|jpe?g|png|gif|avif)/i.test(v)
        ) as string;
        return targetValue || null;
    }
}