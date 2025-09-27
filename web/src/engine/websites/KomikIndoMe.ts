import { Tags } from '../Tags';
import icon from './KomikIndoMe.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return MangaStream.DefaultLinkInfoExtractor.call(this, anchor.querySelector('div.bigor div.tt'), new URL(anchor.href));
}

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'h1.entry-title')
@Common.MangasMultiPageCSS('div.bs div.bsx a', Common.PatternLinkGenerator('/project/page/{page}/'), 0, MangaInfoExtractor)
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikindome', 'KomikIndoMe', 'https://komikindo4.link', Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }
}