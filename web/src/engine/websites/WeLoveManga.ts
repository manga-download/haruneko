import { Tags } from '../Tags';
import icon from './WeLoveManga.webp';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import { FlatManga, MangaLabelExtractor, chapterScript, pageScript, queryMangaTitle } from './templates/FlatManga';

@Common.MangaCSS(/^{origin}\/(mgraw-)?\d+\/$/, queryMangaTitle, MangaLabelExtractor)
@Common.ChaptersSinglePageJS(chapterScript, 1500)
@Common.PagesSinglePageJS(pageScript, 1500)
export default class extends FlatManga {
    public constructor() {
        super('welovemanga', 'WeloveManga', 'https://welovemanga.one', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return await FetchWindowScript(new Request(new URL('/manga-list.html', this.URI)), 'true', 3000, 15000);//trigger antiDDOSS
    }
}