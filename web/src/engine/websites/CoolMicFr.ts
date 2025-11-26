import { Tags } from '../Tags';
import icon from './CoolMic.webp';
import CoolMic from './CoolMic';
import { Exception } from '../Error';
import { type Chapter, Page } from '../providers/MangaPlugin';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import { Fetch, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

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

export default class extends CoolMic {

    public constructor () {
        super('coolmicfr', 'CoolMic (French)', 'https://fr.coolmic.me', [ Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.French, Tags.Source.Official ]);
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(`./viewer/episodes/${chapter.Identifier}`, this.apiUrl));
        const { image_data, signed_cookie } = await FetchJSON<APIPages>(request);
        if (!signed_cookie) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        return image_data.map(page => new Page<CookieSigner>(this, chapter, new URL(page.path), { ...signed_cookie }));
    }

    public override async FetchImage(page: Page<CookieSigner>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const cookies = Object.keys(page.Parameters).map(name => `${name}=${page.Parameters[name]}`).join(';');
            const response = await Fetch(new Request(page.Link, {
                signal: signal,
                headers: {
                    Cookie: cookies,
                    Referer: page.Link.origin,
                }
            }));
            return response.blob();
        }, priority, signal);
    }

}