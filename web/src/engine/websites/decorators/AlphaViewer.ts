// Common code for AlphaManga and AlphaPolis

import { GetBytesFromBase64 } from '../../BufferEncoder';
import { AddAntiScrapingDetection, FetchRedirection } from '../../platform/AntiScrapingDetection';
import type { MangaScraper, Page } from '../../providers/MangaPlugin';
import type { Priority } from '../../taskpool/DeferredTask';
import DeScramble from '../../transformers/ImageDescrambler';
import * as Common from './Common';
import { ThrowOnUnsupportedDecoratorContext } from './Common';

function ReadUShortLittleEndian(raw: Uint8Array<ArrayBuffer>, offset: number): number {
    return raw[offset] | raw[offset + 1] << 8;
};

export type PageData = {
    key: string;
};

export function AddAlphaAntiScraping(regex: RegExp) {
    AddAntiScrapingDetection(async (invoke) => {
        const result = await invoke<boolean>(`document.documentElement.innerHTML.includes('window.awsWafCookieDomainList')`);
        return result ? FetchRedirection.Automatic : undefined;
    }, regex);
};

export function ExtractKeys(base64String: string): Uint8Array<ArrayBuffer>[] {
    // Remove the data URL prefix if present, then decode base64 to a binary buffer
    const base64Data = base64String.includes('base64,')
        ? base64String.substring(base64String.indexOf('base64,') + 7)
        : base64String;

    const raw = GetBytesFromBase64(base64Data);

    const keys: Uint8Array<ArrayBuffer>[] = [];
    let pos = 33; // Right after the PNG signature + IHDR chunk

    while (pos + 2 <= raw.length) {
        const count = ReadUShortLittleEndian(raw, pos);
        const length = count * 8;
        const dataStart = pos + 2;
        const dataEnd = dataStart + length;

        if (dataEnd > raw.length) break;

        keys.push(raw.slice(dataStart, dataEnd));
        pos = dataEnd;
    }
    return keys;
}

/**
 * An extension method to get the image data for the given {@link page} according to an XHR based-approach.
 * @param this - A reference to the {@link MangaScraper} instance which will be used as context for this method
 * @param page - A reference to the {@link Page} containing the necessary information to acquire the image data
 * @param priority - The importance level for ordering the request for the image data within the internal task pool
 * @param signal - An abort signal that can be used to cancel the request for the image data
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 * @param deProxifyLink - Remove common image proxies and try to bypass {@link https://developers.cloudflare.com/images/polish/ | CF Image Polish} (default false)
 */
export async function FetchImageAjax(this: MangaScraper, page: Page<PageData>, priority: Priority, signal: AbortSignal, detectMimeType = false, deProxifyLink = false): Promise<Blob> {
    const blob = await Common.FetchImageAjax.call(this, page, priority, signal, detectMimeType, deProxifyLink);
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

/**
 * A class decorator that adds the ability to get the image data for a given page by loading the source asynchronous with the `Fetch API`.
 * @param detectMimeType - Force a fingerprint check of the image data to detect its mime-type (instead of relying on the Content-Type header)
 * @param deProxifyLink - Remove common image proxies and try to bypass {@link https://developers.cloudflare.com/images/polish/ | CF Image Polish} (default false)
 */
export function ImageAjax(detectMimeType = false, deProxifyLink = false) {
    return function DecorateClass<T extends Common.Constructor>(ctor: T, context?: ClassDecoratorContext): T {
        ThrowOnUnsupportedDecoratorContext(context);
        return class extends ctor {
            public async FetchImage(this: MangaScraper, page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
                return FetchImageAjax.call(this, page, priority, signal, detectMimeType, deProxifyLink);
            }
        };
    };
}