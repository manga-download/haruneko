import { Tags } from '../Tags';
import icon from './Alphapolis.webp';
import { type Chapter, DecoratableMangaScraper, Page, type MangaPlugin, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';
import { GetBase64FromBytes, GetBytesFromBase64 } from '../BufferEncoder';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

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

type PageData = {
    key: string;
};

const tokenScript = `cookieStore.get('XSRF-TOKEN').then(({ value }) => decodeURIComponent( value ) ?? null).catch(error => null);`;

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<boolean>(`document.documentElement.innerHTML.includes('window.awsWafCookieDomainList')`);
    return result ? FetchRedirection.Automatic : undefined;
}, /https:\/\/(?:www\.)?alphapolis\.co\.jp/);

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
        const token = await FetchWindowScript<string>(new Request(this.URI), tokenScript, 500);
        const fullHdImages = await this.GetImagesLinks(chapter, token);
        const fallbackImages = await this.GetImagesLinks(chapter, token, 'standard');

        const source = fullHdImages ?? fallbackImages;
        if (!source || !source.images) {
            throw new Error("Failed to retrieve image links for chapter.");
        }
        const { images, keys } = source;
        return images.map((image, index) => new Page<PageData>(this, chapter, new URL(image), { key: keys ? GetBase64FromBytes(keys[index]): null }));
    }

    private ReadUShortLittleEndian(raw: Uint8Array<ArrayBuffer>, offset: number): number {
        return raw[offset] | raw[offset + 1] << 8;
    };

    private ExtractKeys(base64String: string): Uint8Array<ArrayBuffer>[] {
        // Remove the data URL prefix if present, then decode base64 to a binary buffer
        const base64Data = base64String.includes("base64,")
            ? base64String.substring(base64String.indexOf("base64,") + 7)
            : base64String;

        const raw = GetBytesFromBase64(base64Data);

        const keys: Uint8Array<ArrayBuffer>[] = [];
        let pos = 33; // Right after the PNG signature + IHDR chunk

        while (pos + 2 <= raw.length) {
            const count = this.ReadUShortLittleEndian(raw, pos);
            const length = count * 8;
            const dataStart = pos + 2;
            const dataEnd = dataStart + length;

            if (dataEnd > raw.length) break;

            keys.push(raw.slice(dataStart, dataEnd));
            pos = dataEnd;
        }
        return keys;
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
                keys: placeholder ? this.ExtractKeys(placeholder) : null
            };
        } catch {
            return null;
        }
    }
    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        if (!page.Parameters.key) return blob;

        const bytes = GetBytesFromBase64(page.Parameters.key);
        const key = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        if (key.byteLength < 8) return blob;

        return DeScramble(blob, async (image, ctx) => {

            const firstValue = key.getInt32(0, true);
            const secondValue = key.getInt32(4, true);
            const tileSize = secondValue >>> 24 & 0xFF;
            const paddingWidth = firstValue >>> 27 & 7;
            if (tileSize === 0) return;

            const cols = Math.ceil(image.width / tileSize);
            const rows = Math.ceil(image.height / tileSize);
            const doublePadding = paddingWidth * 2;
            const baseTileSize = tileSize - doublePadding;
            const outW = image.width - cols * doublePadding;
            const outH = image.height - rows * doublePadding;
            const lastCol = cols - 1;
            const lastRow = rows - 1;
            if (outW <= 0 || outH <= 0) return;

            ctx.canvas.width = outW;
            ctx.canvas.height = outH;

            const tileCount = Math.floor(key.byteLength / 8);
            for (let idx = 0; idx < tileCount; idx++) {
                const offset = idx * 8;
                const tileConfigV = key.getInt32(offset, true);
                const tileConfigHa = key.getInt32(offset + 4, true);

                const isMirrored = tileConfigV & 1; // mirror flag
                const rotationSteps = tileConfigV >>> 1 & 3; // rotation: 0..3 -> 0/-90/-180/-270 deg
                const destTop = tileConfigV >>> 3 & 4095; // destination top (minus padding)
                const destLeft = tileConfigV >>> 15 & 4095; // destination left (minus padding)
                const sourceRow = tileConfigHa >>> 8 & 0xFF;
                const sourceCol = tileConfigHa >>> 16 & 0xFF;

                const currentTileWidth = (baseTileSize !== 0 && Math.floor(destLeft / baseTileSize) === lastCol ? outW - destLeft : baseTileSize) + doublePadding;
                const currentTileHeight = (baseTileSize !== 0 && Math.floor(destTop / baseTileSize) === lastRow ? outH - destTop : baseTileSize) + doublePadding;

                const drawWidth = rotationSteps % 2 === 1 ? currentTileHeight : currentTileWidth;
                const drawHeight = rotationSteps % 2 === 1 ? currentTileWidth : currentTileHeight;

                const drawX = destLeft - paddingWidth;
                const drawY = destTop - paddingWidth;

                const sourceX = Math.max(0, Math.min(sourceCol * tileSize, image.width));
                const sourceY = Math.max(0, Math.min(sourceRow * tileSize, image.height));
                const cropWidth = Math.max(0, Math.min(drawWidth, image.width - sourceX));
                const cropHeight = Math.max(0, Math.min(drawHeight, image.height - sourceY));
                if (cropWidth <= 0 || cropHeight <= 0) continue;

                ctx.save();
                ctx.translate(drawX + drawWidth / 2, drawY + drawHeight / 2);
                ctx.rotate(-90 * rotationSteps * Math.PI / 180);
                if (isMirrored !== 0) {
                    ctx.scale(-1, 1);
                }

                // Draw cropped sub-region from the source image centered locally
                ctx.drawImage(image, sourceX, sourceY, cropWidth, cropHeight, -cropWidth / 2, -cropHeight / 2, cropWidth, cropHeight);
                ctx.restore();
            }
        });
    }
}