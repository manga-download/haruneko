import { Tags } from '../Tags';
import icon from './PelaTeam.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaAndChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname + 'Computer/' + anchor.search,
        title: anchor.text.replace(/\[\d+p\.\]/, '').trim()
    };
}

const pageScript = `imageArray.map(image => new URL(window.location.pathname+image, window.location.origin));`;

@Common.MangaCSS(/^{origin}\/Computer\/\?manga=[^#]+$/, 'div.nomeserie a', Common.ElementLabelExtractor(), true)
@Common.MangasSinglePageCSS('/Computer/', 'div.theList div.nomeserie > a', MangaAndChapterExtractor)
@Common.ChaptersSinglePageCSS('div.theList a[title = "Capitolo Italiano"]', MangaAndChapterExtractor)
@Common.PagesSinglePageJS(pageScript)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pelateam', `Pela Team`, 'https://pelateam.org', Tags.Language.Italian, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}