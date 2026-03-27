import { Tags } from '../Tags';
import icon from './LimonManga.webp';
import { TurkMangaBase } from './templates/TurkMangaBase';

export default class extends TurkMangaBase {

    public constructor() {
        super('limonmanga', 'Limon Manga', 'https://limonmanga.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.Turkish);
        this.WithCDN('https://limonmangacdn6.efsaneler.can.re');
    }

    public override get Icon() {
        return icon;
    }
}