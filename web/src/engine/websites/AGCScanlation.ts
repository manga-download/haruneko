import { Tags } from '../Tags';
import icon from './AGCScanlation.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+$/, '.nomeserie span', Common.WebsiteInfoExtractor({ includeSearch: true }))
@Common.MangasSinglePageCSS<HTMLAnchorElement>('/serie.php', 'div.containerprogetti > div.manga > a', anchor => ({
    id: anchor.pathname + anchor.search, title: anchor.querySelector('.nomeserie span').textContent.trim()
}))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div.capitoli_cont > a', undefined, anchor => ({
    id: (anchor.pathname + anchor.search).replace('reader.php', 'readerr.php'), title: anchor.text.trim()
}))
@Common.PagesSinglePageCSS('div.centrailcorrente > img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('agcscanlation', 'AGCScanlation', 'http://www.agcscanlation.it', Tags.Language.Italian, Tags.Source.Scanlator, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}
