import { Tags } from './../Tags';
import icon from './Kuaikanmanhua.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function LabelExtractor(element: HTMLElement) {
    return element.textContent.split('|').shift().trim();
}

const chapterScript = `
    new Promise(resolve => {
        let pages = [];
        try {
            pages = __NUXT__.data[0].comics.map(comic => {
                return {
                    id: '/web/comic/' + comic.id,
                    title: comic.title.trim()
                };
            }).reverse();
        } catch (error) {
            pages = __NUXT__.data[0].comicList.map(comic => {
                return {
                    id: '/web/comic/' + comic.id,
                    title: comic.title.trim()
                };
            }).reverse();
        }

        resolve(pages);
    });
`;

const pageScript = `
        new Promise(resolve => {
            resolve( __NUXT__.data[0].comicInfo.comicImages.map(img => img.url));
        });
        `;

@Common.MangaCSS(/https:\/\/www\.kuaikanmanhua\.com/, 'head title', LabelExtractor)
@Common.MangasMultiPageCSS('/tag/0?page={page}', 'div.tagContent div a')
@Common.ChaptersSinglePageJS(chapterScript, 500)
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kuaikanmanhua', `Kuaikanmanhua`, 'https://www.kuaikanmanhua.com', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}
