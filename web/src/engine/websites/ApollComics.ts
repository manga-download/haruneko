import { Tags } from '../Tags';
import icon from './ApollComics.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Apoll"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('apollcomics', 'Apoll Comics', 'https://apollcomics.es', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}