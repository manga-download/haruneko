import { Tags } from '../Tags';
import icon from './MyToon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Zbulu from './decorators/WordPressZbulu';

@Zbulu.MangaCSS(/^https:\/\/mytoon\.net\/[^/]+\/$/)
@Zbulu.MangasMultiPageCSS()
@Zbulu.ChaptersMultiPageCSS()
@Common.PagesSinglePageCSS(Zbulu.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mytoon', `MyToon`, 'https://mytoon.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}