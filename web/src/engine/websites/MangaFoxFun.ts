import { Tags } from '../Tags';
import icon from './MangaFoxFun.webp';
import { MangaHubBase } from './templates/MangaHubBase';

export default class extends MangaHubBase {

    public constructor() {
        super('mangafoxfun', `MangaFoxFun`, 'https://mangafox.fun', 'mf01', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}