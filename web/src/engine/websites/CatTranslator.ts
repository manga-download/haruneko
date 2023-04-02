import { Tags } from '../Tags';
import icon from './CatTranslator.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/cats-translator\.com\/manga\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Cat-Translator"])')
@Madara.MangasMultiPageAJAX(undefined, 0, '/manga')
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cat-translator', 'Cat-Translator', 'https://cats-translator.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Thai, Tags.Accessibility.RegionLocked/*Thailand*/);
    }

    public override get Icon() {
        return icon;
    }
}