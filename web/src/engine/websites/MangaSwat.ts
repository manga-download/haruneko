import { Tags } from '../Tags';
import icon from './MangaSwat.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.infox h1')
@MangaStream.MangasSinglePageCSS('div.soralist ul li a.series', '/manga/list-mode')
@MangaStream.ChaptersSinglePageCSS('div.bixbox.bxcl ul li span.lchx a')
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaswat', 'MangaSwat', 'https://maxlevelteam.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}