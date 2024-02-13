import { Tags } from '../Tags';
import icon from './PornComix.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function PageLinkExtractor(anchor: HTMLAnchorElement) {
    return anchor.href;
}

@Common.MangaCSS(/^{origin}\/gallery/, 'div.entry-inner header h1')
@Common.MangasMultiPageCSS('/multporn-net/page/{page}/', 'div.entry-body header h3 a')
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('figure a', PageLinkExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('porncomix', `PornComix`, 'https://bestporncomix.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Comic, Tags.Rating.Erotica, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}
