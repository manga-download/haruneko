import { Tags } from '../Tags';
import icon from './MangaEighteenClub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaReader from './decorators/MangaReaderCMS';

export const pageScript = `
    new Promise(resolve => {
        resolve(window.slides_p_path.map(element => window.atob(element)));
    });
`;

@Common.MangaCSS(/^{origin}\/manhwa\/[^/]+$/, 'div.detail_infomation div.detail_name')
@Common.MangasMultiPageCSS('/list-manga/{page}', 'div.story_item div.mg_info div.mg_name > a' )
@Common.ChaptersSinglePageCSS(MangaReader.queryChapters, MangaReader.ChapterInfoExtractor)
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga18-club', `Manga18.club`, 'https://manga18.club', Tags.Language.English, Tags.Media.Manhwa, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}