import { Tags } from '../Tags';
import icon from './MangaLib.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('.media-card__title').textContent.trim()
    };
}

const chapterScript = `
    new Promise(resolve => {
        const chapters = window.__DATA__.chapters.list.map(entry => {
            return {
                id: '/' + window.__DATA__.manga.slug + '/v' + entry.chapter_volume + '/c' + entry.chapter_number,
                title: entry.chapter_number + (entry.chapter_name ? ' - ' + entry.chapter_name : '')
            };
        });
        resolve(chapters);
    });
`;

const pageScript = `
    new Promise(resolve => {
        resolve(window.__pg.map(page => window.__info.servers.main + window.__info.img.url + page.u));
    });
`;

@Common.MangaCSS(/^{origin}\/[^/]+(\?section=info)?$/, 'div.media-name__body div.media-name__main')
@Common.MangasMultiPageCSS('/manga-list?page={page}', 'div.media-card-wrap a.media-card', 1, 1, 0, MangaExtractor)
@Common.ChaptersSinglePageJS(chapterScript, 500)
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangalib', 'MangaLib', 'https://mangalib.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Russian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}
