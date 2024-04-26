import { Tags } from '../Tags';
import icon from './JuinJutsuTeam.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise ( resolve=> {
        resolve (pages.map(page => page.url));
    });
`;

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'div#container_comic_content div.title_high')
@Common.MangasMultiPageCSS('/directory/page/{page}/', 'div.series_element div.info div.title a')
@Common.ChaptersSinglePageCSS('div.title_chapter a')
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('juinjutsuteam', 'JuinJutsu Team', 'https://www.juinjutsureader.ovh', Tags.Media.Manga, Tags.Language.Italian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}