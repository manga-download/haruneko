import { Tags } from '../Tags';
import icon from './MangaTown.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

//Modded DM5 script
const pageScript = `
    new Promise(async (resolve, reject) => {
        try {
            const pagecount = window.total_pages;
            const images = await Promise.all([...new Array(pagecount).keys()].map(async p => {
                eval(await $.ajax({
                    url: 'chapterfun.ashx',
                    data: {
                        cid: window.chapter_id,
                        page: p + 1,
                    }
                }));
                return d[0];
            }));
            resolve(images.map(link => new URL(link, window.location.href).href));
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
        const pages = await Common.FetchPagesSinglePageJS.call(this, chapter, pageScript);
        return pages.map(page => new Page(this, chapter, page.Link, { Referer: 'https://mangahere.com' }));
    }
}