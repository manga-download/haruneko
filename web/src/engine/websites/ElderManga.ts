import { Tags } from '../Tags';
import icon from './ElderManga.webp';
import { TurkMangaBase } from './templates/TurkMangaBase';

export default class extends TurkMangaBase {

    public constructor() {
        super('eldermanga', 'ElderManga', 'https://eldermanga.com', 'https://manga3.efsaneler.can.re', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}