var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Tags } from '../Tags';
import icon from './MangaDig.webp';
import { DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript, Fetch } from '../platform/FetchProvider';
const PageScript = `
    new Promise((resolve, reject) => {

        function tryResolve() {
            if (decryptionKey) {
                clearInterval(timeout);
                resolve({
                    images : picz,
                    key : decryptionKey,
                });
            }
        }

        const nativeDecrypt = CryptoJS.AES.decrypt;
        let decryptionKey = undefined;
        CryptoJS.AES.decrypt = function (r, i, n) {
            if (r.ciphertext) {
                decryptionKey = i;
                CryptoJS.AES.decrypt = nativeDecrypt;
            }
            return nativeDecrypt(r, i, n);
        };

        const cookiename = __cad.getCookieValue()[1] + mh_info.pageid.toString();
        const totalimgs = parseInt($.cookie(cookiename));

        const picz = [];
        for( let i = 1 ; i <= totalimgs; i++) {
            picz.push(__cr.getPicUrl(i));
        }

        [...document.querySelectorAll('div.mh_comicpic')].pop().scrollIntoView();
        const timeout = setInterval(tryResolve, 1000);
    });
`;
let default_1 = class extends DecoratableMangaScraper {
    constructor(id = 'mangadig', label = `MangaDig`, url = 'https://mangadig.com', tags = [Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Source.Official]) {
        super(id, label, url, ...tags);
    }
    get Icon() {
        return icon;
    }
    async FetchPages(chapter) {
        const request = new Request(new URL(chapter.Identifier, this.URI));
        const data = await FetchWindowScript(request, PageScript, 1500);
        const key = data.key ? this.ConvertWordArrayToUint8Array(data.key) : undefined;
        return data.images.map(page => {
            return new Page(this, chapter, new URL(page, this.URI), { key: key });
        });
    }
    ConvertWordArrayToUint8Array(wordArray) {
        const len = wordArray.words.length;
        const u8_array = new Uint8Array(len << 2);
        let offset = 0;
        let word;
        let i;
        for (i = 0; i < len; i++) {
            word = wordArray.words[i];
            u8_array[offset++] = word >> 24;
            u8_array[offset++] = word >> 16 & 255;
            u8_array[offset++] = word >> 8 & 255;
            u8_array[offset++] = word & 255;
        }
        return u8_array;
    }
    async FetchImage(page, priority, signal) {
        return this.imageTaskPool.Add(async () => {
            const request = new Request(page.Link, {
                headers: {
                    Referer: this.URI.href,
                    Origin: this.URI.origin
                }
            });
            const response = await Fetch(request);
            const data = await response.blob();
            const key = page.Parameters.key;
            if (!key)
                return data;
            const encrypted = await data.arrayBuffer();
            const decrypted = await this.DecryptPicture(new Uint8Array(encrypted), key);
            return Common.GetTypedData(decrypted);
        }, priority, signal);
    }
    async DecryptPicture(encrypted, key) {
        const iv = Buffer.from('0000000000000000');
        const secretKey = await crypto.subtle.importKey('raw', key, {
            name: 'AES-CBC',
            length: 128
        }, true, ['encrypt', 'decrypt']);
        return crypto.subtle.decrypt({
            name: 'AES-CBC',
            iv: iv
        }, secretKey, encrypted);
    }
};
default_1 = __decorate([
    Common.MangaCSS(/^{origin}\/manga-[^/]+\//, 'dl.fed-deta-info dd.fed-deta-content h1.fed-part-eone'),
    Common.MangasMultiPageCSS('/show?page={page}', 'ul.fed-list-info li.fed-list-item a.fed-list-title'),
    Common.ChaptersSinglePageCSS('div.all_data_list ul li a')
], default_1);
export default default_1;
