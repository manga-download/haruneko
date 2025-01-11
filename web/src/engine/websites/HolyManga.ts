import { Tags } from '../Tags';
import icon from './HolyManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^https:\/\/w\d+\.holymanga\.net\/[^/]+\.html$/, FlatManga.queryMangaTitle, FlatManga.MangaLabelExtractor)
@Common.MangasMultiPageCSS(FlatManga.pathMultiPageManga, FlatManga.queryMangas, 1, 1, 0, FlatManga.MangaExtractor)
@Common.ChaptersSinglePageCSS(FlatManga.queryChapters, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS(FlatManga.queryPages, FlatManga.PageLinkExtractor)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('holymanga', 'Holy Manga', 'https://w34.holymanga.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}