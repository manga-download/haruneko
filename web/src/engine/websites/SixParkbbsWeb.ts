import { Tags } from '../Tags';
import icon from './SixParkbbsWeb.webp';
import * as Common from './decorators/Common';
import SixParkbbsClub from './SixParkbbsClub';

@Common.ChaptersUniqueFromManga()
@Common.ImageAjax()
export default class extends SixParkbbsClub {

    //FetchManga
    protected mangaRegex = /^{origin}\/index\.php\?app=forum&act=view&tid=\d+/;
    protected queryMangaTitle = 'div.c-box p.c-box-h b';

    //FetchMangas
    protected sub = '';
    protected path = '/index.php?app=forum&act=bbs&bbsid=2032&p={page}';
    protected queryManga = 'div#d_list div.repl-list-one a:nth-child(1)';
    protected queryMatch = /.*\[漫画\]/;

    //Fetchpages
    protected queryPages = 'div.cen-main div.c-box-m center img';

    public constructor() {
        super('sixparkbbsweb', `6parkbbs Web(新❀华漫)`, 'https://web.6parkbbs.com', [Tags.Language.Chinese, Tags.Media.Manga, Tags.Source.Aggregator]);
    }

    public override get Icon() {
        return icon;
    }
}