import { Tags } from '../Tags';
import icon from './Ero18x.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

function CleanTitle(text: string): string {
    return text.replace(/>>.*$/, '').trim();
}

function MangaLinkExtractor(element: HTMLSpanElement, uri: URL) {
    return {
        id: uri.pathname,
        title: CleanTitle(element.innerText),
    };
}

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: CleanTitle(anchor.text)
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'span.rate-title', MangaLinkExtractor)
@Common.MangasMultiPageCSS('div.post-title h3 a', Common.PatternLinkGenerator('/page/{page}/'), 0, MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('li.wp-manga-chapter a')
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ero18x', 'Ero18x', 'https://ero18x.com', Tags.Media.Manhwa, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}