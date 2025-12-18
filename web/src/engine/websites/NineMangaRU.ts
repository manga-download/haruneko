import { Tags } from '../Tags';
import icon from './NineMangaRU.webp';
import { NineMangaBase } from './templates/NineMangaBase';

export default class extends NineMangaBase {
    public constructor() {
        super('ninemanga-ru', `NineMangaRU`, 'https://ru.ninemanga.com', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }

}