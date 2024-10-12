import { Exception } from '../Error';
import { Tags } from '../Tags';
import { FetchJSON } from '../platform/FetchProvider';
import {type MangaPlugin, Manga, type Chapter, Page } from '../providers/MangaPlugin';
import icon from './Bomtoon.webp';
import Delitoon, { type APIManga, type APIResult } from './Delitoon';
import * as Common from './decorators/Common';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

type APIMangas = {
    content: APIManga[]
}

type APIPages = {
    isScramble: boolean,
    images: {
        imagePath: string,
        line: string,
        point: string,
        defaultHeight: number,

    }[]
}

type ScrambleParams = {
    scrambleIndex: number[],
    defaultHeight: number,

}

export default class extends Delitoon {

    public constructor() {
        super('bomtoon', `Bomtoon`, 'https://www.bomtoon.com', 'BOMTOON_COM', [Tags.Language.Korean, Tags.Media.Manhwa, Tags.Source.Official]);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const url = new URL('/api/balcony-api/search/all', this.URI);
        const promises = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(character => {
            url.search = new URLSearchParams({
                searchText: character,
                isCheckDevice: 'true',
                isIncludeAdult: 'true',
                contentsThumbnailType: 'MAIN',
                size: '9999'
            }).toString();
            return FetchJSON<APIResult<APIMangas>>(this.CreateRequest(url));
        });

        const results = (await Promise.all(promises)).reduce((accumulator: Manga[], element) => {
            const mangas = element.data.content.map(element => new Manga(this, provider, element.alias, element.title.trim()));
            accumulator.push(...mangas);
            return accumulator;
        }, []);
        return results.distinct();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<ScrambleParams>[]> {
        await this.UpdateToken();
        const url = new URL(`contents/viewer/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiUrl);
        url.searchParams.set('isNotLoginAdult', 'true');
        const { result, data: { images, isScramble } } = await FetchJSON<APIResult<APIPages>>(this.CreateRequest(url));
        if (result === 'ERROR') {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }

        if (isScramble) {
            const endpoint = new URL(`contents/images/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiUrl);
            const body = JSON.stringify({ line: images[0].line });
            const { data } = await FetchJSON<APIResult<string>>(this.CreatePostRequest(endpoint, body));
            const pages: Page<ScrambleParams>[] = [];
            for (let image of images) {
                const scrambleIndex = await this.Decrypt(image.point, data);
                pages.push(new Page<ScrambleParams>(this, chapter, new URL(image.imagePath), { scrambleIndex, defaultHeight: image.defaultHeight }));
            }
            return pages;
        } else return images.map(element => new Page<ScrambleParams>(this, chapter, new URL(element.imagePath), { scrambleIndex: undefined, defaultHeight: undefined }));

    }

    async Decrypt(encrypted: string, scramblekey: string): Promise<number[]> {
        const iv = Buffer.from(scramblekey.slice(0, 16));
        const keyBuffer = Buffer.from(scramblekey);
        const encryptedBuffer = Buffer.from(encrypted, 'base64');
        const cipher = { name: 'AES-CBC', iv: iv };
        const key = await crypto.subtle.importKey('raw', keyBuffer, { name: 'AES-CBC', length: 256 }, true, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(cipher, key, encryptedBuffer);
        return JSON.parse(new TextDecoder('utf-8').decode(decrypted)) as number[];
    }

    public override async FetchImage(page: Page<ScrambleParams>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        const scrambledata = page.Parameters;
        return !scrambledata.scrambleIndex ? blob : DeScramble(blob, async (image, ctx) => {
            scrambledata.scrambleIndex.forEach((scramblevalue, index) => {
                const pieceWidth = image.width / 4;
                const pieceHeight = scrambledata.defaultHeight / 4;
                const sourceX = index % 4 * pieceWidth;
                const sourceY = Math.floor(index / 4) * pieceHeight;
                const destinationX = scramblevalue % 4 * pieceWidth;
                const destinationY = Math.floor(scramblevalue / 4) * pieceHeight;
                ctx.drawImage(image, sourceX, sourceY, pieceWidth, pieceHeight, destinationX, destinationY, pieceWidth, pieceHeight);
            });

        });
    }
}
