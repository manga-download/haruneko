import { Tags } from '../Tags';
import icon from './UzayManga.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchNextJS } from '../platform/FetchProvider';

type HydratedPages = {
    series_items: {
        path: string;
    }[];
};

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('.chapternum').textContent.trim()
    };
}

// TODO: Check for possible revision (FetchNextJS)

@Common.MangaCSS(/^{origin}\/manga\/\d+\/[^/]+$/, 'div.content-details h1')
@Common.MangasMultiPageCSS('/?page={page}', 'div.overflow-hidden.grid.grid-cols-1 > div > a')
@Common.ChaptersSinglePageCSS('div.list-episode a', ChapterExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly cdnUrl = 'https://manga2.efsaneler.can.re';

    public constructor() {
        super('uzaymanga', 'Uzay Manga', 'https://uzaymanga.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { series_items } = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'series_items' in data);
        return series_items.map(({ path }) => new Page(this, chapter, new URL(path, this.cdnUrl), { Referer: this.URI.href }));
    }
}