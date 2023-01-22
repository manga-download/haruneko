// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './DelitoonDE.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('delitoonde', `Delitoon (German)`, 'https://www.delitoon.de' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DelitoonDE extends Delitoon {

    constructor() {
        super();
        super.id = 'delitoonde';
        super.label = 'Delitoon (German)';
        this.tags = [ 'webtoon', 'german' ];
        this.url = 'https://www.delitoon.de';
        this.links = {
            login: 'https://www.delitoon.de/connexion'
        };
    }

    async _getMangas() {
        let mangaList = [];
        let genres = ['Romance', 'Boys%20Love', 'Drama', 'Sentimental', 'Historisch', 'Slice%20of%20Life', 'Fantasy', 'Komödie', 'Thriller', 'Action', 'Abenteuer', 'Sci-Fi'];
        for(let genre of genres) {
            let mangas = await this._getMangasFromPage(genre);
            mangaList.push(...mangas);
        }
        return mangaList;
    }

}
*/