import { Tags } from '../Tags';
import icon from './AGCScanlation.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const title = anchor.querySelector('.nomeserie span').textContent.trim();
    const id = anchor.pathname + anchor.search;
    return { id, title };
}

function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    const title = anchor.text.trim();
    const id = (anchor.pathname + anchor.search).replace('reader.php', 'readerr.php');
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/[^/]+$/, '.nomeserie span', Common.ElementLabelExtractor(), true)
@Common.MangasSinglePageCSS('/serie.php', 'div.containerprogetti > div.manga > a', MangaInfoExtractor)
@Common.ChaptersSinglePageCSS('div.capitoli_cont > a', ChapterInfoExtractor)
@Common.PagesSinglePageCSS('div.centrailcorrente > img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('agcscanlation', `AGCScanlation`, 'http://www.agcscanlation.it', Tags.Language.Italian, Tags.Source.Scanlator, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

}
