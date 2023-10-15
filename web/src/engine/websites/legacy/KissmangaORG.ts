import { Tags } from '../../Tags';
import icon from './KissmangaORG.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

@Common.MangaCSS(/^https?:\/\/kissmanga\.org\/manga\/[^/]+$/, 'strong.bigChar')
@Common.MangasMultiPageCSS('/manga_list?page={page}&action=list&q=', 'div.listing div.item_movies_in_cat div a.item_movies_link', 1, 1)
@Common.ChaptersSinglePageCSS('div#leftside div.full div.episodeList div.full div.listing.full div div h3 a')
@Common.PagesSinglePageCSS('div.barContent div.full div.full.watch_container div#centerDivVideo img')
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kissmangaorg', `Kissmanga.org`, 'https://kissmanga.org', Tags.Language.English, Tags.Source.Aggregator, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }
}