import { Tags } from '../Tags';
import icon from './UzayManga.webp';
import { TurkMangaBase } from './templates/TurkMangaBase';

export default class extends TurkMangaBase {

    public constructor() {
        super('uzaymanga', 'Uzay Manga', 'https://uzaymanga.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Scanlator);
        this.WithCDN('https://uzaymangacdn3.efsaneler.can.re');
    }

    public override get Icon() {
        return icon;
    }
}