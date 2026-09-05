//import { Tags } from '../../Tags';
import icon from './NovelcoolRU.webp';
import { NineMangaBase } from '../templates/NineMangaBase';

export default class extends NineMangaBase {

    public constructor() {
        super('novelcool-ru', `Novel Cool (RU)`, 'https://ru.novelcool.com' /*, Tags.Language.English, Tags ... */);
        this.ChaptersOnMangaPage();
    }

    public override get Icon() {
        return icon;
    }
}