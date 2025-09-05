import { Tags } from '../Tags';
import icon from './NineMangaEN.webp';
import { TAADBase } from './templates/TAADDBase';

export default class extends TAADBase {
    public constructor() {
        super('ninemanga-en', `NineMangaEN`, 'https://ninemanga.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}