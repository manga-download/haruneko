import { Exception } from '../Error';
import { Tags } from '../Tags';
import { FetchJSON } from '../platform/FetchProvider';
import {type MangaPlugin, Manga, type Chapter, Page } from '../providers/MangaPlugin';
import icon from './Bomtoon.webp';
import * as Common from './decorators/Common';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';
import { DelitoonBase, type APIManga, type APIResult } from './templates/DelitoonBase';
import { GetBytesB64, GetBytesUTF8 } from '../BufferEncoder';

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

export default class extends DelitoonBase {

    public constructor() {
        super('bomtoon', `Bomtoon`, 'https://www.bomtoon.com', Tags.Language.Korean, Tags.Media.Manhwa, Tags.Source.Official);
        this.BalconyID = 'BOMTOON_COM';
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
        const { result, error, data: { images, isScramble } } = await FetchJSON<APIResult<APIPages>>(this.CreateRequest(url));
        if (result == 'ERROR') {
            switch (error.code) {
                case 'NOT_LOGIN_USER':
                case 'UNAUTHORIZED_CONTENTS':
                    throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
            }
        }

        if (isScramble) {
            const endpoint = new URL(`contents/images/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.apiUrl);
            const body = JSON.stringify({ line: images[0].line });
            const { data } = await FetchJSON<APIResult<string>>(this.CreateRequest(endpoint, true, body));
            const promises = images.map(async image => {
                const scrambleIndex = await this.Decrypt(image.point, data);
                return new Page<ScrambleParams>(this, chapter, new URL(image.imagePath), { scrambleIndex, defaultHeight: image.defaultHeight });
            });
            return Promise.all(promises);
        } else return images.map(element => new Page(this, chapter, new URL(element.imagePath)));
    }

    private async Decrypt(encrypted: string, scramblekey: string): Promise<number[]> {
        const cipher = { name: 'AES-CBC', iv: GetBytesUTF8(scramblekey.slice(0, 16)) };
        const key = await crypto.subtle.importKey('raw', GetBytesUTF8(scramblekey), { name: 'AES-CBC', length: 256 }, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(cipher, key, GetBytesB64(encrypted));
        return JSON.parse(new TextDecoder('utf-8').decode(decrypted)) as number[];
    }

    public override async FetchImage(page: Page<ScrambleParams>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        const scrambledata = page.Parameters;
        return !scrambledata?.scrambleIndex ? blob : DeScramble(blob, async (image, ctx) => {
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