import { Tags } from '../Tags';
import icon from './ManhwaDashRaw.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

function CleanTitle(text: string): string {
    return text.replace(/–.*$/, '').trim();
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'p.manga-adult-title', (element, uri) => ({ id: uri.pathname, title: CleanTitle(element.innerText) }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.post-title h3 a', Common.PatternLinkGenerator('/page/{page}/'), 0, anchor => ({ id: anchor.pathname, title: CleanTitle(anchor.text) }))
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