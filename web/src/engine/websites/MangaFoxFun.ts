import { Tags } from '../Tags';
import icon from './MangaFoxFun.webp';
import { MangaHubBase } from './templates/MangaHubBase';

export default class extends MangaHubBase {

    public constructor() {
        super('mangafoxfun', `MangaFoxFun`, 'https://mangafox.fun', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
        this.path = 'mf01';
    }

    public override get Icon() {
        return icon;
    }
}