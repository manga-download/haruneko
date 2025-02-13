import { Tags } from '../Tags';
import icon from './ComicPorta.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { SpeedBindVersion } from './decorators/SpeedBinb';

function ChapterExtractor(element: HTMLElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a').pathname,
        title: element.parentNode.querySelector<HTMLParagraphElement>('p.title').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/series\/\d+\/$/, 'div#breadcrumb li:last-of-type')
@Common.MangasSinglePagesCSS(['/series/'], 'div.series-list ul li h3.title a')
@Common.ChaptersSinglePageCSS('ul.episode-list li.episode div.inner div.wrap p.episode-btn', ChapterExtractor)
@SpeedBinb.PagesSinglePageAjax(SpeedBindVersion.v016061)
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicporta', `COMICポルタ (Comic Porta)`, 'https://comic-porta.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}
