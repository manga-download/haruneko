import { Tags } from '../Tags';
import icon from './RawMangatop.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from './../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/[^/]+$/, 'div.info h1.title')
@Common.MangasMultiPageCSS('/directory?page={page}', 'div.item-info div.series-title a')
@Common.ChaptersSinglePageCSS('ul.chapter-list li > a')
@Common.PagesSinglePageCSS('div.reader img.picture')
@Common.ImageAjax(true, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rawmangatop', `Raw Manga (生漫画)`, 'https://rawmanga.top', Tags.Media.Manga, Tags.Language.Japanese, Tags.Language.Korean, Tags.Source.Aggregator);
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('viewer', '1')`);
    }

    public override get Icon() {
        return icon;
    }
}