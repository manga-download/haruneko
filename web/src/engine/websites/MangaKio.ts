import { Tags } from '../Tags';
import icon from './MangaKio.webp';
import { MangakBase } from './templates/MangakBase';

export default class extends MangakBase {

    public constructor() {
        super('mangakio', 'MangaKio', 'https://mangak.io', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}