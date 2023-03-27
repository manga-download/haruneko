import { Tags } from '../Tags';
import icon from './RawSenManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchRequest, FetchWindowScript } from './../FetchProvider';

@Common.MangaCSS(/^https?:\/\/raw\.senmanga\.com/, 'div.desc h1.series')
@Common.MangasMultiPageCSS('/directory?page={page}', 'div.item-info div.series-title a')
@Common.ChaptersSinglePageCSS('ul.chapter-list li > a')
@Common.PagesSinglePageCSS('div.reader img.picture')
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rawsenmanga', `RawSenManga`, 'https://raw.senmanga.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override async Initialize(): Promise<void> {
        const request = new FetchRequest(this.URI.href);
        return FetchWindowScript(request, `window.cookieStore.set('viewer', '1')`);
    }

    public override get Icon() {
        return icon;
    }
}