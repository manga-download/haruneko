import { Tags } from '../Tags';
import icon from './NineMangaIT.webp';
import { NineMangaBase } from './templates/NineMangaBase';

export default class extends NineMangaBase {
    public constructor() {
        super('ninemanga-it', `NineMangaIT`, 'https://it.ninemanga.com', Tags.Language.Italian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}