import { Tags } from '../Tags';
import icon from './LerHentais.webp';
import { HiperManga } from './templates/HiperManga';

export default class extends HiperManga {

    public constructor() {
        super('lerhentais', 'LerHentais', 'https://lerhentais.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}