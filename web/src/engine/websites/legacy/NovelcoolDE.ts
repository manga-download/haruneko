//import { Tags } from '../../Tags';
import icon from './NovelcoolDE.webp';
import { NineMangaBase } from '../templates/NineMangaBase';

export default class extends NineMangaBase {

    public constructor() {
        super('novelcool-de', `Novel Cool (DE)`, 'https://de.novelcool.com' /*, Tags.Language.English, Tags ... */);
        this.ChaptersOnMangaPage();
    }

    public override get Icon() {
        return icon;
    }
}