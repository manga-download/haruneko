import { Tags } from '../Tags';
import icon from './MangaHack.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const chapterScript = `
    new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            let morebtn = document.querySelector('div.more_btn a');
            if (morebtn) morebtn.click()
            else {
                clearInterval(interval);
                const chapters = [...document.querySelectorAll('div.episodes_area div.comicList_box p.title a')];
                resolve( chapters.map(chapter => {
                    return { id : chapter.pathname, title : chapter.textContent.trim()}
                }));
            }
        }, 500);
    });
`;

@Common.MangaCSS(/^{origin}\/comics\/\d+$/, 'div.comicTitle_toppage h1')
@Common.MangasMultiPageCSS('/search/comics?page={page}', 'div.comicList_box .title a')
@Common.ChaptersSinglePageJS(chapterScript, 2500)
@Common.PagesSinglePageCSS('div.episodeViewer div.comic_img img')
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangahack', `マンガハック (MangaHack)`, 'https://mangahack.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}