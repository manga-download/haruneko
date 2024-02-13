import { Tags } from '../Tags';
import icon from './MangaNato.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaNel from './decorators/MangaNel';
import * as Common from './decorators/Common';

@MangaNel.MangaCSS(/^https?:\/\/(m\.|chap\.)?(read|chap)?manganato\.(com|to)\/manga-/)
@MangaNel.MangasMultiPageCSS()
@MangaNel.ChaptersSinglePageCSS()
@MangaNel.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manganato', 'Manganato', 'https://manganato.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}