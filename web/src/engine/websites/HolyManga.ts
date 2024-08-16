import { Tags } from '../Tags';
import icon from './HolyManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import { FetchWindowScript } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import * as Zbulu from './decorators/WordPressZbulu';

@Common.MangaCSS(/^https?:\/\/(w\d*\.)?holymanga.net\/[^/]+\/$/, Zbulu.queryManga, Zbulu.MangaLabelExtractor)
@Zbulu.MangasMultiPageCSS()
@Zbulu.ChaptersMultiPageCSS()
@Common.PagesSinglePageCSS(Zbulu.queryPages)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('holymanga', `Holy Manga`, 'https://holymanga.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation );
    }
    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}