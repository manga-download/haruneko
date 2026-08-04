import { Tags } from '../Tags';
import icon from './HadesScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'h1#cx-series-title')
@MangaStream.MangasSinglePageCSS()
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('a.cx-chapter-item', undefined, anchor => ({ id: anchor.pathname, title: anchor.querySelector('.cx-chapter-item__title').textContent.trim() }))
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hadesscans', 'Hades Scans', 'https://hadesscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}