import { Tags } from '../Tags';
import icon from './MangaTown.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

//Modded DM5 script
const pageScript = `
    new Promise(async (resolve, reject) => {
        try {
            const pagecount = window.total_pages;
            const pages = [];
            for (let page = 1; page <= pagecount; page++) {
                const response = await fetch('chapterfun.ashx?cid='+ window.chapter_id + '&page=' + page);
                const script = await response.text();
                eval(script);
                pages.push(d[0]);
            }
            resolve(pages.map(link => new URL(link, window.location.href).href));

        } catch(error) {
            reject(error);
        }
    });
`;

@Common.MangaCSS(/^{origin}\/manga\//, 'div.article_content h1.title-top')
@Common.MangasMultiPageCSS('/directory/0-0-0-0-0-0/{page}.htm', 'ul.manga_pic_list li p.title a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('ul.chapter_list li a')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatown', `MangaTown`, 'https://www.mangatown.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await FetchWindowScript<string[]>(new Request(new URL(chapter.Identifier, this.URI)), pageScript);
        return data.map(link => new Page(this, chapter, new URL(link), { Referer: 'https://mangahere.com' }));
    }
}