import { Tags } from '../Tags';
import icon from './EightComic.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/html\/\d+\.html$/, 'meta[name="name"]')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.cat2_list a', Common.PatternLinkGenerator('/comic/u-{page}.html'), 0, anchor => ({
    id: anchor.pathname, title: anchor.querySelector('.cat2_list_name').textContent.trim()
}))
@Common.ChaptersSinglePageJS(`
    new Promise( resolve => {
        const baselink = 'https://articles.onemoreplace.tw/online/new-' + location.pathname.split('/').at(-1)+'?ch=';
        const chapters = [...document.querySelectorAll('div#chapters ul li > a')];
        resolve( chapters.map( chapter => {
            return {
                id: baselink + chapter.getAttribute('onclick').match(/-(\\d+)\.html/).at(1),
                title: chapter.innerText.trim()
            };
        }).reverse());
    })
`, 500)
@Common.PagesSinglePageJS('[...document.querySelectorAll("div.comics-pic img")].map(img => new URL(decodeURIComponent(img.getAttribute("s") || img.getAttribute("src")), location.href).href);', 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('eightcomic', '8Comic', 'https://www.8comic.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}