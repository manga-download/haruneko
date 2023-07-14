import { Tags } from '../../Tags';
import icon from './SixParkbbsClub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import * as SixParkbbs from '../decorators/SixParkbbs';

@Common.MangaCSS(/^https?:\/\/club\.6parkbbs\.com\/enter6\/index\.php\?app=forum&act=threadview&tid=\d+/, 'td.show_content font b', SixParkbbs.MangaLabelExtractor, true)
@SixParkbbs.MangasMultiPageCSS('/index.php?app=forum&act=list&pre=55764&nowpage={page}&start=55764', 'div#d_list ul li a:nth-child(1)', /(【(连载|英肉|短篇|生肉|韩肉)】.*)|(\[连载\].*)/, '/enter6')
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('td.show_content pre img', SixParkbbs.PagesExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sixparkbbsclub', `6parkbbs (卡通漫画)`, 'https://club.6parkbbs.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}