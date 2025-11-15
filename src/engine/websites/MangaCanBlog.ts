import { Tags } from '../Tags';
import icon from './MangaCanBlog.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

const script = `
    new Promise(resolve => {
        const pages = [...document.querySelectorAll('img.ts-main-image')].map(image => image.src);
        resolve(pages);
    });
 `;

@MangaStream.MangaCSS(/^https?:\/\/mangacanblog\.com\/[^/]+$/)
@MangaStream.MangasSinglePageCSS('div.blix ul li a.series', '/daftar-komik-manga-bahasa-indonesia.html')
@MangaStream.ChaptersSinglePageCSS()
@Common.PagesSinglePageJS(script, 5000) //pages list html is encrypted
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangacanblog', 'MangaCan Blog', 'https://mangacanblog.com', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}