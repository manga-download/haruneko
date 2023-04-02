import { Tags } from '../Tags';
import icon from './CutiePie.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/cutiepie\.ga\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
// TODO: Website region locked?
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cutiepie', 'Cutie Pie', 'https://cutiepie.moe', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish);
    }

    public override get Icon() {
        return icon;
    }
}