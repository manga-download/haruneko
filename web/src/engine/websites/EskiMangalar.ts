import { Tags } from '../Tags';
import icon from './EskiMangalar.webp';
import { TurkMangaBase } from './templates/TurkMangaBase';

export default class extends TurkMangaBase {

    public constructor() {
        super('eskimangalar', 'Eski Mangalar', 'https://eskimangalar.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Scanlator);
        this.WithCDN('https://eskimangalarcdn5.efsaneler.can.re');
    }

    public override get Icon() {
        return icon;
    }
}