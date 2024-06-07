import { Tags } from '../Tags';
import icon from './Zhuzhumh.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const queryChaptersScript = `
    new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            let morebtn = document.querySelector('a#zhankai:not([style*="display"])');
            if (morebtn) morebtn.click()
            else {
                clearInterval(interval);
                const chapters = [...document.querySelectorAll('ul#mh-chapter-list-ol-0 li a')];
                resolve( chapters.map(chapter => {
                    return { id : chapter.pathname, title : chapter.textContent.trim()}
                }));
            }
        }, 500);
    });
`;

@Common.MangaCSS(/^{origin}\/book\/[^/]+\.html$/, 'div.cy_title h1')
@Common.MangasMultiPageCSS('/sort/1-{page}.html', 'div.cy_list_mh ul li.title a')
@Common.ChaptersSinglePageJS(queryChaptersScript)
@Common.PagesSinglePageJS('newImgs', 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('zhuzhumh', `Zhuzhumh`, 'https://www.zhuzhumh.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}