import { Tags } from '../Tags';
import icon from './KomikIndoMe.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

function MangaInfosExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: MangaStream.MangaLabelExtractor.call(this, anchor.querySelector('div.bigor div.tt'))
    };
}

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'h1.entry-title')
@Common.MangasMultiPageCSS('/project/page/{page}/', 'div.bs div.bsx a', 1, 1, 0, MangaInfosExtractor)
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikindome', 'KomikIndoMe', 'https://komikindo.link', Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}