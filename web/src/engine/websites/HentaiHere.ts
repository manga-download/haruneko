import { Tags } from '../Tags';
import icon from './HentaiHere.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterInfoExtractor(element: HTMLAnchorElement) {
    element.querySelectorAll('i').forEach(bloat => bloat.parentElement?.removeChild(bloat));
    return {
        id: element.pathname,
        title: element.innerText.split('-').shift().trim(),
    };
}

const script = `new Promise(resolve => resolve(rff_imageList.map(page => 'https://hentaicdn.com/hentai'+ page)));`;

@Common.MangaCSS(/^{origin}\/m\/[^/]+$/, 'div.bg-black h4 a', Common.ElementLabelExtractor('span'))
@Common.MangasMultiPageCSS('/directory?page={page}', 'div.item a.text-ellipsis')
@Common.ChaptersSinglePageCSS('li.sub-chp a#chapterBlock', ChapterInfoExtractor)
@Common.PagesSinglePageJS(script, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaihere', `HentaiHere`, 'https://hentaihere.com', Tags.Language.English, Tags.Media.Manga, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}