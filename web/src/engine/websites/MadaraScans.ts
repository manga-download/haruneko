import { Tags } from '../Tags';
import icon from './MadaraScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'h1.lh-title')
@MangaStream.MangasSinglePageCSS(undefined, '/series/list-mode/')
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div#chapters-list-container div.ch-item a.ch-main-anchor', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('.ch-num').textContent.trim()
}))
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('madarascans', 'Madara Scans', 'https://madarascans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}