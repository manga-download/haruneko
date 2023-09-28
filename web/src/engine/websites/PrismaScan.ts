import { Tags } from '../Tags';
import icon from './PrismaScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/prismascans\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('prismascans', 'Prisma Scan', 'https://prismascans.net', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Portuguese);
    }

    public override get Icon() {
        return icon;
    }
}