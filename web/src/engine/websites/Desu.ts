import { Tags } from '../Tags';
import icon from './Desu.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const scriptPages = `Reader.images.map(element => new URL(element.url, window.location.origin).href);`;

@Common.MangaCSS(/^{origin}\/[^/]+\//, 'div.titleBar h1 span.name')
@Common.MangasMultiPageCSS('h3 a.animeTitle.oTitle', Common.PatternLinkGenerator('/manga/?page={page}'))
@Common.ChaptersSinglePageCSS('div#animeView div.expandable ul.chlist li h4 a')
@Common.PagesSinglePageJS(scriptPages, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('desu', `Desu`, 'https://desu.city', Tags.Language.Russian, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}
