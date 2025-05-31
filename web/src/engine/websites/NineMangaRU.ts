import { Tags } from '../Tags';
import icon from './NineMangaRU.webp';
import { TAADBase } from './templates/TAADDBase';

export default class extends TAADBase {
    public constructor() {
        super('ninemanga-ru', `NineMangaRU`, 'https://ru.ninemanga.com', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }

}