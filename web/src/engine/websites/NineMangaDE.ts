import { Tags } from '../Tags';
import icon from './NineMangaDE.webp';
import { NineMangaBase } from './templates/NineMangaBase';

export default class extends NineMangaBase {
    public constructor() {
        super('ninemanga-de', `NineMangaDE`, 'https://de.ninemanga.com', Tags.Language.German, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}