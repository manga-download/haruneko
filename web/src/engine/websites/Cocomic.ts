import { Tags } from '../Tags';
import icon from './Cocomic.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cocomic', 'Cocomic', 'https://cocomic.co', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}