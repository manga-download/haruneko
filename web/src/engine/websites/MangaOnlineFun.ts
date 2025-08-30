import { Tags } from '../Tags';
import icon from './MangaOnlineFun.webp';
import { MangaHubBase } from './templates/MangaHubBase';

export default class extends MangaHubBase {

    public constructor() {
        super('mangaonlinefun', `MangaOnlineFun`, 'https://mangaonline.fun', 'm02', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}