import { Tags } from '../Tags';
import icon from './ManhuaBuddy.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manhwa\/[^/]+$/, 'div.title_content h1')
@Common.MangasMultiPageCSS('/?page={page}', 'div.item h3.title a')
@Common.ChaptersSinglePageCSS('ul#chapter-list li a')
@Common.PagesSinglePageCSS('div.chapter-content div.item-photo img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('manhuabuddy', 'Manhua Buddy', 'https://manhuabuddy.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}