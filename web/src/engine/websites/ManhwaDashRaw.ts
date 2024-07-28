import { Tags } from '../Tags';
import icon from './ManhwaDashRaw.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

function MangaLabelExtractor(element: HTMLElement): string {
    return StripLabelJunk(element.textContent);
}

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: StripLabelJunk(anchor.text)
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'span.rate-title', MangaLabelExtractor)
@Common.MangasMultiPageCSS('/page/{page}/', 'div.post-title h3 a', 1, 1, 0, MangaInfoExtractor)
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
function StripLabelJunk(text: string): string {
    return text.replace(/–.*$/, '').trim();
}