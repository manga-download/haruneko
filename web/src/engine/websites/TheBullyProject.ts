import { Tags } from '../Tags';
import icon from './MangaClash.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+$/, 'ol.bc-list li:last-of-type span')
@Common.MangasMultiPageCSS('div.card-body a', Common.PatternLinkGenerator('/genres/all/{page}'))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div#epList a.ep-item', undefined, anchor => ({ id: anchor.pathname, title: anchor.querySelector('div div h3').textContent.trim() }))
@Common.PagesSinglePageJS('IMAGE_MAP.map(image => new URL(image, window.location.origin).href);', 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('thebullyproject', 'The Bully Project', 'https://thebullyproject.com', Tags.Media.Manhua, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}