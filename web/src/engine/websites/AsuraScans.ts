import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import icon from './AsuraScans.webp';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';

const excludes = [
    /panda_gif_large/i,
    /2021\/04\/page100-10\.jpg/i,
    /2021\/03\/20-ending-page-\.jpg/i,
    /ENDING-PAGE/i,
    /EndDesignPSD/i
];

const chapterScript = `
    new Promise( resolve => {
        resolve( [...document.querySelectorAll('a[href*="/chapter/"]:has(h3.text-xs)')].map(chapter => {
            return {
                id: chapter.pathname.replace(/(-[^-]+\\/chapter)/, '-/chapter'),
                title : chapter.querySelector('h3').innerText.replace('\\n', ' ').trim()
            };
        }));
    });
`;

const pagesScript = `[... document.querySelectorAll('div.items-center div div.center img')].map(image=> image.src);`;

function MangaLinkExtractor(title: HTMLTitleElement, uri: URL) {
    return {
        id: uri.pathname.replace(/-[^-]+$/, '-'),
        title: title.innerText.replace(/-[^-]+$/, '').trim(),
    };
}

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname.replace(/-[^-]+$/, '-'),
        title: anchor.querySelector('div.items-center span.font-bold').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'head title', MangaLinkExtractor)
@Common.MangasMultiPageCSS('div.grid a', Common.PatternLinkGenerator('/series?page={page}'), 0, MangaInfoExtractor)
@Common.ChaptersSinglePageJS(chapterScript, 500)
@MangaStream.PagesSinglePageJS(excludes, pagesScript, 1000)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('asurascans', 'Asura Scans', 'https://asuracomic.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript<string>(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}