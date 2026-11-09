import { Tags } from '../Tags';
import icon from './PortalYaoi.webp';
import type { Chapter } from '../providers/MangaPlugin';
import { DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchHTML } from '../platform/FetchProvider';
import { GetBytesFromBase64, GetBytesFromUTF8, GetUTF8FromBytes } from '../BufferEncoder';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageCSS()
@Madara.ChaptersSinglePageAJAXv2('li.wp-manga-chapter > a:not(.reward_ads)')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('portalyaoi', 'Portal Yaoi', 'https://portalyaoi.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Rating.Pornographic, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const doc = await FetchHTML(new Request(new URL(chapter.Identifier, this.URI)));
        const container = doc.querySelector<HTMLElement>('.chapter-content-protected');
        if (container) {
            const decrypted = await this.DecryptAESGCM(container.dataset.enc, container.dataset.iv, container.dataset.tag, container.dataset.token);
            const wrapper = document.createElement('div');
            wrapper.innerHTML = decrypted;
            doc.body.appendChild(wrapper);
        }

        const decrypt = (url: string) => GetUTF8FromBytes(GetBytesFromBase64(url.split('').reverse().join('')));

        return [...doc.querySelectorAll<HTMLImageElement>('.wp-manga-chapter-img')].map(image => {
            const url = image.dataset.obf ? decrypt(image.dataset.obf) : image.dataset.src ?? image.src;
            return new Page(this, chapter, new URL(url, this.URI));
        });
    }

    async DecryptAESGCM(encB64: string, ivB64: string, tagB64: string, token: string) {
        const enc = GetBytesFromBase64(encB64);
        const iv = GetBytesFromBase64(ivB64);
        const tag = GetBytesFromBase64(tagB64);

        const combined = new Uint8Array(enc.length + tag.length);
        combined.set(enc);
        combined.set(tag, enc.length);

        const keyMaterial = await crypto.subtle.importKey('raw', GetBytesFromUTF8(token), 'PBKDF2', false, ['deriveKey']);
        const aesKey = await crypto.subtle.deriveKey(
            { name: 'PBKDF2', salt: GetBytesFromUTF8('novel-protect'), iterations: 50000, hash: 'SHA-256' },
            keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['decrypt']
        );
        const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, aesKey, combined);
        return GetUTF8FromBytes(decrypted);
    }
}