import { Tags } from '../Tags';
import icon from './JeazScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga(\/[^/]+|\.php\?id=\d+)$/, 'h1.uppercase.blood-title', Common.WebsiteInfoExtractor({ includeSearch: true }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a.cultivation-card', Common.PatternLinkGenerator('/directorio.php?page={page}'), 0, anchor => ({
    id: `/manga.php${anchor.search}`, title: anchor.querySelector('img.manual-img').getAttribute('alt').trim()
}))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div#chaptersContainer a.chapter-item', undefined, anchor =>
    ({ id: anchor.pathname, title: anchor.querySelector('.chapter-title').textContent.trim() }))
@Common.PagesSinglePageJS(`
    new Promise( resolve => {
        resolve (
            [...document.querySelectorAll('div.page-container img')].map( img => {
                return img.dataset.verify ? new URL([...atob(img.dataset.verify)].reverse().join(''), location).href : img.src
            })
        );
    });
`, 1000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('jeazscans', 'Jeaz Scans', 'https://lectorhub.j5z.xyz', Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}