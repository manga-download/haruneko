import { Tags } from '../Tags';
import icon from './RawInu.webp';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import { FlatManga, MangaLabelExtractor, chapterScript, pageScript } from './templates/FlatManga';

@Common.MangaCSS(/^{origin}\/[^/]+\.html$/, 'li.breadcrumb-item.active', MangaLabelExtractor)
@Common.ChaptersSinglePageJS(chapterScript, 2500)
@Common.PagesSinglePageJS(pageScript, 1500)
export default class extends FlatManga {
    public constructor() {
        super('rawinu', 'RawInu', 'https://rawinu.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return await FetchWindowScript(new Request(new URL('/manga-list.html', this.URI)), 'true', 3000, 15000);//trigger antiDDOSS
    }
}