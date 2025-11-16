import { Tags } from '../Tags';
import icon from './MangaPanda.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

const chapterScript = `
    new Promise ( resolve => {
        resolve( [...document.querySelectorAll('div.content div.chapter-list ul li a')].map(chapter => {
            return {
                id: chapter.pathname,
                title : chapter.textContent.trim()
            }
        }));
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'ol.breadcrumb li:last-of-type a')
@Common.MangasMultiPageCSS('div.media div.media-body > a', Common.PatternLinkGenerator('?page={page}'))
@Common.ChaptersSinglePageJS(chapterScript, 2500)
@Common.PagesSinglePageJS(`document.querySelector('p#arraydata').textContent.trim().split(',');`, 250)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangapanda', `MangaPanda`, 'https://www.mangapanda.in', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        //trigger Cloudflare at initialization
        return await FetchWindowScript(new Request(new URL('/manga/-/', this.URI)), '');
    }
}