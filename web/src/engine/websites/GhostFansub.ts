import { Tags } from '../Tags';
import icon from './GhostFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

//TODO: add login page ?

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Ghost Fansub"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ghostfansub', 'Ghost Fansub', 'https://ghostfansub.online', Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Rating.Pornographic, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}