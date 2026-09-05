import { Tags } from '../../Tags';
import icon from './NovelcoolEN.webp';
import { NineMangaBase } from '../templates/NineMangaBase';

export default class extends NineMangaBase {

    public constructor() {
        super('novelcool-en', `Novel Cool (EN)`, 'https://www.novelcool.com' /*, Tags.Language.English, Tags ... */);
        this.ChaptersOnMangaPage();
    }

    public override get Icon() {
        return icon;
    }

}