// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NovelcoolBR.webp';
import { NineMangaBase } from '../templates/NineMangaBase';

export default class extends NineMangaBase {

    public constructor() {
        super('novelcool-br', `Novel Cool (BR)`, 'https://br.novelcool.com' /*, Tags.Language.English, Tags ... */);
        this.ChaptersOnMangaPage();
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NovelcoolBR extends Novelcool {
    constructor() {
        super();
        super.id = 'novelcool-br';
        super.label = 'Novel Cool (BR)';
        this.tags = [ 'portuguese', 'manga', 'webtoon'];
        this.url = 'https://br.novelcool.com';
        this.links = {
            login: 'https://br.novelcool.com/login.html'
        };
    }
}
*/