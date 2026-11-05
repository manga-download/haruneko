import { Tags } from '../Tags';
import icon from './APKomik.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageElement(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('apkomik', 'APKomik', 'https://01.apkomik.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        //trigger Cloudflare at initialization
        return await FetchWindowScript(new Request(new URL('/manga/-/', this.URI)), '');
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await FetchWindowScript<string[]>(new Request(new URL(chapter.Identifier, this.URI)), 'ts_reader_control.getImages();');
        return pages.map(page => new Page(this, chapter, new URL(page, this.URI), { Referer: this.URI.href }));
    }
}