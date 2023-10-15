import { Tags } from '../Tags';
import icon from './SixParkbbsWeb.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SixParkbbs from './decorators/SixParkbbs';

@Common.MangaCSS(/^https?:\/\/web\.6parkbbs\.com\/index\.php\?app=forum&act=view&tid=\d+/, 'div.c-box p.c-box-h b', SixParkbbs.MangaLabelExtractor, true)
@SixParkbbs.MangasMultiPageCSS('/index.php?app=forum&act=bbs&bbsid=2032&p={page}', 'div#d_list div.repl-list-one a:nth-child(1)', /.*\[漫画\]/)
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('div.cen-main div.c-box-m center img', SixParkbbs.PagesExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sixparkbbsweb', `6parkbbs (新❀华漫)`, 'https://web.6parkbbs.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}