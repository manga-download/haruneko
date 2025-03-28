import { Tags } from '../Tags';
import icon from './HolyManga.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^https:\/\/w\d+\.holymanga\.net\/[^/]+\.html$/, FlatManga.queryMangaTitle)
@Common.MangasMultiPageCSS(FlatManga.pathMangasMultiPage, FlatManga.queryMangas)
@Common.ChaptersSinglePageCSS(FlatManga.queryChapters, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS(FlatManga.queryPages, (img: HTMLImageElement) => img.dataset.original ?? img.src)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('holymanga', 'Holy Manga', 'https://w34.holymanga.net' /* 193.36.132.201 */, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}