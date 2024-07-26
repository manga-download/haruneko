import { Tags } from '../Tags';
import icon from './AsuraScans.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

const excludes = [
    /panda_gif_large/i,
    /2021\/04\/page100-10\.jpg/i,
    /2021\/03\/20-ending-page-\.jpg/i,
    /ENDING-PAGE/i,
    /EndDesignPSD/i
];

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname.replace(/-[^-]+$/, '-'),
        title: anchor.querySelector('div.items-center span.font-bold').textContent.trim()
    };
}

const chapterScript = `
    new Promise (resolve => {
        resolve([...document.querySelectorAll('div.scrollbar-thumb-themecolor a.block')].map(link => {
            return {
                id: link.pathname.replace(/-[^-]+(\\/chapter)/, '-$1'),
                title : link.querySelector('div > h3').textContent.trim()
            };
        }));
    });
`;
@Common.MangasMultiPageCSS('/series?page={page}', 'div.grid a', 1, 1, 0, MangaInfoExtractor)
@Common.ChaptersSinglePageJS(chapterScript)
@MangaStream.PagesSinglePageCSS(excludes, 'img[alt="chapter"]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('asurascans', 'Asura Scans', 'https://asuracomic.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript<string>(new Request(this.URI), 'window.location.origin');
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(this: DecoratableMangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
        return MangaStream.FetchMangaCSS.call(this, provider, url.replace(/-[^-]+$/, '-'), 'div.bg-white div.relative span.text-xl.font-bold');
    }
}