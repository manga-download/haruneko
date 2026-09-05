//import { Tags } from '../../Tags';
import icon from './NovelcoolIT.webp';
import { NineMangaBase } from '../templates/NineMangaBase';

export default class extends NineMangaBase {

    public constructor() {
        super('novelcool-it', `Novel Cool (IT)`, 'https://it.novelcool.com' /*, Tags.Language.English, Tags ... */);
        this.ChaptersOnMangaPage();
    }

    public override get Icon() {
        return icon;
    }
}