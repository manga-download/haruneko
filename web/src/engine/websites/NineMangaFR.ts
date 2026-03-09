import { Tags } from '../Tags';
import icon from './NineMangaFR.webp';
import { NineMangaBase } from './templates/NineMangaBase';

export default class extends NineMangaBase {
    public constructor() {
        super('ninemanga-fr', `NineMangaFR`, 'https://fr.ninemanga.com', Tags.Language.French, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }

}