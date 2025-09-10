import { Tags } from '../Tags';
import icon from './TenshiManga.webp';
import { TurkMangaBase } from './templates/TurkMangaBase';

export default class extends TurkMangaBase {

    public constructor () {
        super('tenshimanga', 'Tenshi Manga', 'https://tenshimanga.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
        this.cdnUrl = 'https://tenshi.efsaneler.can.re/'; // 'https://manga1.efsaneler.can.re/'
    }

    public override get Icon() {
        return icon;
    }
}