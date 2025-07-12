import { Tags } from '../Tags';
import icon from './MangaHereFun.webp';
import { MangaHubBase } from './templates/MangaHubBase';

export default class extends MangaHubBase {

    public constructor() {
        super('mangaherefun', `MangaHereFun`, 'https://mangahere.onl', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
        this.path = 'mh01';
    }

    public override get Icon() {
        return icon;
    }
}