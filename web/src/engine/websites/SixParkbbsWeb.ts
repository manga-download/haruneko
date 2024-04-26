import { Tags } from '../Tags';
import icon from './SixParkbbsClub.webp';
import { DecoratableMangaScraper, type MangaPlugin, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchMangas, PageExtract } from './SixParkbbsClub';

@Common.MangaCSS(/^{origin}\/index\.php\?app=forum&act=view&tid=\d+/, 'div.c-box p.c-box-h b', undefined, true)
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('div.cen-main div.c-box-m center img', PageExtract)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sixparkbbsweb', '6parkbbs Web (新❀华漫)', 'https://web.6parkbbs.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return FetchMangas.call(
            this, provider, '/index.php', '?app=forum&act=bbs&bbsid=2032',
            'div#main div#main_right',
            'div#d_list div.repl-list-one > a:nth-child(1)',
            'div#d_list_page a:last-of-type');
    }
}