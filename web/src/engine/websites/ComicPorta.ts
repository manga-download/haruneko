import { Tags } from '../Tags';
import icon from './ComicPorta.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';

@Common.MangaCSS(/^{origin}\/series\/\d+\/$/, 'div#breadcrumb li:last-of-type')
@Common.MangasSinglePageCSS('/series/', 'div.series-list ul li h3.title a')
@Common.ChaptersSinglePageCSS('ul.episode-list li.episode div.inner div.wrap p.episode-btn', undefined, element => ({
    id: element.querySelector<HTMLAnchorElement>('a').pathname,
    title: element.parentNode.querySelector<HTMLParagraphElement>('p.title').textContent.trim()
}))
@SpeedBinb.PagesSinglePageAjax()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicporta', `COMICポルタ (Comic Porta)`, 'https://comic-porta.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}
