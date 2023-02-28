import { Tags } from '../Tags';
import icon from './MangaPill.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

let pathMangas = '/search?q=&type=&status=&genre=Action&genre=Adventure&genre=Cars&genre=Comedy&genre=Dementia&genre=Demons&genre=Doujinshi&genre=Drama&genre=Ecchi&genre=Fantasy&genre=Game&genre=Gender+Bender&genre=Harem&genre=Hentai&genre=Historical&genre=Horror&genre=Isekai&genre=Josei&genre=Kids&genre=Magic&genre=Martial+Arts&genre=Mecha&genre=Military&genre=Music&genre=Mystery&genre=Parody&genre=Police&genre=Psychological&genre=Romance&genre=Samurai&genre=School&genre=Sci-Fi&genre=Seinen&genre=Shoujo&genre=Shoujo+Ai&genre=Shounen&genre=Shounen+Ai&genre=Slice+of+Life&genre=Space&genre=Sports&genre=Super+Power&genre=Supernatural&genre=Thriller&genre=Vampire&genre=Yaoi&genre=Yuri';
pathMangas += '&page={page}';

@Common.MangaCSS(/^https?:\/\/mangapill\.com\/manga\//, 'div.container h1')
@Common.MangasMultiPageCSS(pathMangas, 'div.container a.mb-2')
@Common.ChaptersSinglePageCSS('div#chapters div a')
@Common.PagesSinglePageCSS('img')
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangapill', `MangaPill`, 'https://mangapill.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}