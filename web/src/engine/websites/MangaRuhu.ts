import { Tags } from '../Tags';
import icon from './MangaRuhu.webp';
import { InitManga } from './templates/InitManga';

export default class extends InitManga {

    public constructor() {
        super('mangaruhu', 'MangaRuhu', 'https://mangaruhu.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.Turkish);
    }

    public override get Icon() {
        return icon;
    }
}