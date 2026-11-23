import { Tags } from '../Tags';
import icon from './MangaKakalot.webp';
import { MangaNel } from './templates/MangaNel';

export default class extends MangaNel {

    public constructor() {
        super('mangakakalot', 'MangaKakalot', 'https://www.mangakakalot.gg', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}