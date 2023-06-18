import { Tags } from '../../Tags';
import icon from './HerosWeb.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as CoreView from '../decorators/CoreView';
import * as Common from '../decorators/Common';

@Common.MangaCSS(/^https?:\/\/viewer\.heros-web\.com\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.MangasMultiPageCSS(['/series/heros', '/series/flat', '/series/wild'])
@CoreView.ChaptersSinglePageCSS()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageDescrambler()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('herosweb', `Hero's (ヒーローズ)`, 'https://viewer.heros-web.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}