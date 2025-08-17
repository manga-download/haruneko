// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './YoungJump.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor () {
        super('youngjump', `ヤングジャンプ / ウルトラジャンプ (young jump/ultra jump)`, 'https://www.youngjump.world' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class YoungJump extends SpeedBinb {

    constructor() {
        super();
        super.id = 'youngjump';
        super.label = 'ヤングジャンプ / ウルトラジャンプ (young jump/ultra jump)';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://www.youngjump.world';
        this.links = {
            login: 'https://www.youngjump.world/?login=1'
        };
    }

    async _getMangas() {
        return [
            {
                id: 'free_uj/',
                title: 'ウルトラジャンプ - ultra jump'
            },
            {
                id: 'free_yj/',
                title: 'ヤングジャンプ - young jump'
            }
        ];
    }

    async _getChapters(manga) {
        const request = new Request(new URL(manga.id, this.url), this.requestOptions);
        const data = await this.fetchDOM(request);

        let chapters = [];
        for (const year of data.querySelectorAll('section.sp-w')) {
            const mangas = [...year.querySelectorAll('a.p-my__list-link')];
            chapters.push(...mangas.map(element => {
                return {
                    id: this.getAbsolutePath(element.href, this.url),
                    title: year.querySelector('h3').innerText.trim() +' - ' + element.querySelector('h4').innerText.trim()
                };
            }));
        }

        return chapters;
    }
}
*/