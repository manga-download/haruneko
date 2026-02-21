import { Tags } from '../Tags';
import icon from './ElderManga.webp';
import { TurkMangaBase } from './templates/TurkMangaBase';

export default class extends TurkMangaBase {

    public constructor() {
        super('eldermanga', 'ElderManga', 'https://eldermanga.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Scanlator);
        this.WithCDN('https://eldermangacdn2.efsaneler.can.re');
    }

    public override get Icon() {
        return icon;
    }
}