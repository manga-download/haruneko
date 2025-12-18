import { Tags } from '../Tags';
import icon from './NineMangaBR.webp';
import { NineMangaBase } from './templates/NineMangaBase';

export default class extends NineMangaBase {
    public constructor() {
        super('ninemanga-br', `NineMangaBR`, 'https://br.ninemanga.com', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}