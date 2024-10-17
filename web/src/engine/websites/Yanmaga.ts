import { Tags } from '../Tags';
import icon from './Yanmaga.webp';
import { type Chapter, DecoratableMangaScraper, type Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchWindowScript } from '../platform/FetchProvider';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('.mod-book-title').textContent.trim()
    };
}

const chapterScript = `
    new Promise(resolve => {
        const interval = setInterval(() => {
            let morebtn = document.querySelector('.mod-episode-more-button') ;
            if (morebtn) morebtn.click()
                else {
                    clearInterval(interval);
                    const chapters = [...document.querySelectorAll('a.mod-episode-link')];
                    resolve(chapters.map(chapter => {
                        return {
                            id: chapter.pathname,
                            title: chapter.querySelector('.mod-episode-title').textContent.trim()
                        }
                    }));
            }
         }, 1000);
    });
`;

@Common.MangaCSS(/^{origin}\/comics\/[^/]+$/, 'h1.detail-header-title, h1.detailv2-outline-title')
@Common.MangasSinglePageCSS('/comics', 'a.ga-comics-book-item', MangaExtractor)
@Common.ChaptersSinglePageJS(chapterScript, 200)
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yanmaga', `Yanmaga`, 'https://yanmaga.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        await FetchWindowScript(new Request(new URL(chapter.Identifier, this.URI), { headers: { Referer: this.URI.origin } }), 'true', 3000);//set necessary cookies
        return SpeedBinb.FetchPagesSinglePageAjaxv016130.call(this, chapter);
    }

}