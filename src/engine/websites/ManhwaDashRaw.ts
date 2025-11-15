import { Tags } from '../Tags';
import icon from './ManhwaDashRaw.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

function CleanTitle(text: string): string {
    return text.replace(/–.*$/, '').trim();
}

function MangaLinkExtractor(span: HTMLSpanElement, uri: URL) {
    return {
        id: uri.pathname,
        title: CleanTitle(span.innerText),
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
        super('manhwadashraw', 'Manhwa-Raw', 'https://manhwa-raw.com', Tags.Media.Manhwa, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}