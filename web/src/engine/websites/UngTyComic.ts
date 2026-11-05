import { Tags } from '../Tags';
import icon from './UngTyComic.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/truyen\/[^/]+$/, 'div.comics-detail-head h1.title-heading')
@Common.MangasMultiPageCSS('h4.content-title a', Common.PatternLinkGenerator('/truyen-tranh?page={page}'))
@Common.ChaptersMultiPageCSS('div.list-comics-chapter div.episode-title a', Common.PatternLinkGenerator('{id}?page={page}'))
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ungtycomic', 'Ung Ty Comic', 'https://ungtycomics.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}