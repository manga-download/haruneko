import { Tags } from '../Tags';
import icon from './MangaPill.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

let pathMangas = '/search?page={page}&';
const genres = ['Action', 'Adventure', 'Cars', 'Comedy', 'Dementia', 'Demons', 'Doujinshi', 'Drama', 'Ecchi', 'Fantasy', 'Game', 'Gender Bender', 'Harem', 'Hentai',
    'Historical', 'Horror', 'Isekai', 'Josei', 'Kids', 'Magic', 'Martial Arts', 'Mecha', 'Military', 'Music', 'Mystery', 'Parody', 'Police', 'Psychological',
    'Romance', 'Samurai', 'School', 'Sci-Fi', 'Seinen', 'Shoujo', 'Shoujo Ai', 'Shounen', 'Shounen Ai', 'Slice of Life', 'Space', 'Sports', 'Super Power',
    'Supernatural', 'Tragedy', 'Thriller', 'Vampire', 'Yaoi', 'Yuri'
];
const search = new URLSearchParams({ 'q': '', 'type': '', 'status': ''});
genres.forEach(genre => search.append('genre', genre));
pathMangas += search.toString();

@Common.MangaCSS(/^{origin}\/manga\//, 'div.container h1')
@Common.MangasMultiPageCSS(pathMangas, 'div.container a.mb-2')
@Common.ChaptersSinglePageCSS('div#chapters div a')
@Common.PagesSinglePageCSS('img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangapill', `MangaPill`, 'https://mangapill.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}