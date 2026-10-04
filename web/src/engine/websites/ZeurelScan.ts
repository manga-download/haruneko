import { Tags } from '../Tags';
import icon from './ZeurelScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/serie\/[^/]+$/, 'div.series-meta h1')
@Common.MangasSinglePageCSS('/series', 'a.series-card')
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div.chapter a', undefined,
    anchor => ({ id: anchor.pathname, title: anchor.text.replace(/\d+\/\d+\/\d+\s*$/, '').replace(/–\s*$/, '').trim() }))
@Common.PagesSinglePageCSS('.reader > img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('zeurelscan', 'ZeurelScan', 'https://www.zeurelscan.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Italian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}