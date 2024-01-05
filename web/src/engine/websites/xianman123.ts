import { Tags } from '../Tags';
import icon from './xianman123.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MH from './decorators/MH';

const pagesScript = `
    new Promise((resolve, reject) => {
        try {
            const pageLinks = picdata.map(pic => imgDomain != '' ? new URL(pic, imgDomain).href : pic);
            resolve(pageLinks);
        } catch (error) {
            reject(error);
        }
    });
 `;

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, MH.queryMangaTitleFromURI)
@Common.MangasMultiPageCSS('/f-1-0-0-0-0-2-{page}.html', MH.queryMangas)
@Common.ChaptersSinglePageCSS(MH.queryChapters, MH.ChapterExtractor)
@Common.PagesSinglePageJS(pagesScript, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xianman123', `XianMan123`, 'https://www.gaonaojin.com', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}