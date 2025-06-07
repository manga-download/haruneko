import { Tags } from '../Tags';
import icon from './MangaKakalotFun.webp';
import { MangaHubBase } from './templates/MangaHubBase';

export default class extends MangaHubBase {

    public constructor() {
        super('mangakakalotfun', `MangaKakalotFun`, 'https://mangakakalot.fun', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
        this.path = 'mn01';
    }

    public override get Icon() {
        return icon;
    }
}