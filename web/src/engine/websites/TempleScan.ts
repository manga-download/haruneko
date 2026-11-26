import { Tags } from '../Tags';
import icon from './TempleScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/comic\/[^/]+$/, 'head meta[property="og:title"]')
@Common.MangasMultiPageCSS('div.grid div.w-full > a:has(h2)', Common.PatternLinkGenerator('/comics?page={page}'))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('ul#chapter-list li a', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('span.truncate').textContent.trim()
}))
@Common.PagesSinglePageJS(`
    new Promise(resolve => {
        const divs = [...document.querySelectorAll('div.protected-content div.protected-content')];
        const intervalId = setInterval(() => {
            divs.forEach(div => {
                if (!div.querySelector('img')) {
                    div.scrollIntoView();
                }
            });

            const sources = divs.map(div => div.querySelector('img')?.src || '');

            if (!sources.some(src => src === '')) {
                clearInterval(intervalId);
                resolve(sources);
            }
        }, 250);
    });
`, 1500)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.templetoons.com/api/';

    public constructor() {
        super('templescan', 'TempleScan', 'https://templetoons.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}