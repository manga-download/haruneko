import { Tags } from '../Tags';
import icon from './HeroTruyen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const chapterScript = `
    new Promise ( ( resolve, reject) => {
        document.querySelector('div#danh-sach-chuong button')?.click();
        setTimeout(() => {
            try {
                resolve ([...document.querySelectorAll('ul#list-chapter-comic li a')].map(chapter => {
                    return {
                        id: chapter.pathname,
                        title: chapter.text.trim()
                    }
                }));
            } catch(error) {
                reject(error);
            }
        }, 2500);
    });
`;

@Common.MangaCSS(/^{origin}\/[^/]+$/, 'ol li:last-of-type a[itemprop="item"]')
@Common.MangasMultiPageCSS('/tim-truyen?page={page}', 'div.grid div.col-span-1 a:has(img)', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageJS(chapterScript, 1500)
@Common.PagesSinglePageCSS('div.relative img[loading="lazy"]')
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('herotruyen', 'Hero Truyen', 'https://truyenti.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}