import { Tags } from '../Tags';
import icon from './FlashManga.webp';
import { type Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { FetchRegex } from '../platform/FetchProvider';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('flashmanga', 'Flash Manga', 'https://www.flash-manga.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Thai, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        // rare MangaStream website using ASC order for chapters
        return (await MangaStream.FetchChaptersSinglePageCSS.call(this, manga)).reverse();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages: string[] = JSON.parse((await FetchRegex(new Request(new URL(chapter.Identifier, this.URI)), /["']images["']\s*:\s*([^\]]+\])/g)).at(0));
        return pages.map(page => new Page(this, chapter, new URL(page)));
    }
}