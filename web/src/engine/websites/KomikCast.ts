import { Tags } from '../Tags';
import icon from './KomikCast.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

function MangaExtractor(element: HTMLDivElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a').pathname,
        title: element.querySelector<HTMLHeadingElement>('h3.title').textContent.trim()
    };
}

@MangaStream.MangaCSS(/^https:\/\/komikcast[0-9]*\.[a-z]{2,3}\/komik\/[^/]+\/$/, 'h1.komik_info-content-body-title')
@Common.MangasMultiPageCSS('div.list-update_item', Common.PatternLinkGenerator('/daftar-komik/page/{page}/'), 0, MangaExtractor)
@MangaStream.ChaptersSinglePageCSS('div.komik_info-chapters ul li.komik_info-chapters-item a.chapter-link-item')
@MangaStream.PagesSinglePageCSS([/999\.jpg/], 'div.main-reading-area img.alignnone, div.separator img.alignnone')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('komikcast', 'KomikCast', 'https://komikcast03.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }
}