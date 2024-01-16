import { Tags } from '../Tags';
import icon from './AsuraScans.webp';
import { type Chapter, DecoratableMangaScraper, Page, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { Fetch, FetchWindowScript } from '../platform/FetchProvider';

type TSReader = source[];

type source = {
    images: string[];
}

const excludes = [
    /panda_gif_large/i,
    /2021\/04\/page100-10\.jpg/i,
    /2021\/03\/20-ending-page-\.jpg/i,
    /ENDING-PAGE/i,
    /EndDesignPSD/i
];

@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('asurascans', 'Asura Scans', 'https://asuratoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const request = new Request(this.URI.href);
        this.URI.href = await FetchWindowScript<string>(request, 'window.location.origin');
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/manga/[^/]+/$`).test(url);
    }

    public override async FetchManga(this: DecoratableMangaScraper, provider: MangaPlugin, url: string): Promise<Manga> {
        return MangaStream.FetchMangaCSS.call(this, provider, url);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        let images: string[] = [];
        try {
            const response = await Fetch(new Request(new URL(chapter.Identifier, this.URI).href));
            const data = await response.text();
            const tsreader: TSReader = JSON.parse(data.match(/"sources":(\[[^;]+\]}\])/m)[1]);
            images = tsreader.shift().images.filter(link => !excludes.some(rgx => rgx.test(link)));
            return images.map(image => new Page(this, chapter, new URL(image)));
        } catch (error) {
            return MangaStream.FetchPagesSinglePageCSS.call(this, chapter, excludes, 'div#readerarea p img');
        }

    }
}