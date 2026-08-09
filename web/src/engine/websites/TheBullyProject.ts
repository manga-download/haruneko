import { Tags } from '../Tags';
import icon from './TheBullyProject.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+$/, 'ol.sh-bc li:last-of-type')
@Common.MangasMultiPageCSS('div.mc-body a.mc-title', Common.PatternLinkGenerator('/genres/all/{page}'), 0, )
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div#epList a.sh-ep', undefined, anchor => ({ id: anchor.pathname, title: anchor.querySelector('h3.sh-ep-label').textContent.trim() }))
@Common.PagesSinglePageJS('IMAGE_MAP.map(image => new URL(image, window.location.origin).href);', 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('thebullyproject', 'The Bully Project', 'https://bully-manga.com', Tags.Media.Manhua, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}