import { Tags } from '../Tags';
import icon from './Kiryuu.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https:\/\/kiryuu\d+\.com\/manga\/[^/]+\/$/, 'h1[itemprop="name"]')
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS('div#chapter-list div[data-chapter-number] > a')
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kiryuu', 'Kiryuu', 'https://kiryuu03.com', Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin;', 0);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}