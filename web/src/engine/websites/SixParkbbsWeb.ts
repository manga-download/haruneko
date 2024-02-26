import { Tags } from '../Tags';
import icon from './SixParkbbsWeb.webp';
import * as Common from './decorators/Common';
import SixParkbbsClub from './SixParkbbsClub';

@Common.ChaptersUniqueFromManga()
@Common.ImageAjax()
export default class extends SixParkbbsClub {

    public constructor() {
        super('sixparkbbsweb', `6parkbbs Web(新❀华漫)`, 'https://web.6parkbbs.com', [Tags.Language.Chinese, Tags.Media.Manga, Tags.Source.Aggregator]);

        this.mangaRegex = /^{origin}\/index\.php\?app=forum&act=view&tid=\d+/;
        this.queryMangaTitle = 'div.c-box p.c-box-h b';
        this.sub = '';
        this.path = '/index.php?app=forum&act=bbs&bbsid=2032&p={page}';
        this.queryManga = 'div#d_list div.repl-list-one a:nth-child(1)';
        this.queryMatch = /.*\[漫画\]/;
        this.queryPages = 'div.cen-main div.c-box-m center img';
    }

    public override get Icon() {
        return icon;
    }
}