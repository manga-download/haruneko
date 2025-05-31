import { Tags } from '../Tags';
import icon from './NineMangaES.webp';
import { TAADBase } from './templates/TAADDBase';

export default class extends TAADBase {
    public constructor() {
        super('ninemanga-es', `NineMangaES`, 'https://es.ninemanga.com', Tags.Language.Spanish, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}