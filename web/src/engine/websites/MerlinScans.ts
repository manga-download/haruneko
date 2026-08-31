import { Tags } from '../Tags';
import icon from './MerlinScans.webp';
import { InitManga } from './templates/InitManga';
import * as Common from './decorators/Common';
import { Page, type Chapter } from '../providers/MangaPlugin';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.ChaptersMultiPageCSS<HTMLAnchorElement>('div.chapter-list a', Common.PatternLinkGenerator('{id}bolum/page/{page}/'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('div.uk-flex-none').textContent.trim()
}))

export default class extends InitManga {

    public constructor() {
        super('merlinscans', 'MerlinToon', 'https://merlintoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await FetchWindowScript<string[]>(new Request(new URL(chapter.Identifier, this.URI)), `
           new Promise((resolve, reject) => {
                const data = typeof InitMangaEncryptedChapter === 'string' ? JSON.parse(InitMangaEncryptedChapter): InitMangaEncryptedChapter;
                const { ciphertext, salt, iv } = data;
                const saltBytes = CryptoJS.enc.Hex.parse(salt);
                const ivBytes = CryptoJS.enc.Hex.parse(iv);

                const key = CryptoJS.PBKDF2(atob(InitMangaData.decryption_key), saltBytes, {
                    hasher: CryptoJS.algo.SHA512,
                    keySize: 8,
                    iterations: 999
                });
                const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
                    iv: ivBytes
                }).toString(CryptoJS.enc.Utf8);

                const doc = new DOMParser().parseFromString(decrypted, 'text/html')
                const pages = [...doc.querySelectorAll('canvas.imc-protected-canvas:not([data-imc-init])')].map(page => {
                    return initMangaResolveImgSrc(page.dataset.enc);
                });

                resolve(pages);
            });

        `, 1500);
        return pages.map(page => new Page(this, chapter, new URL(page), { Referer: this.URI.href }));
    }
}