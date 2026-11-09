import { Tags } from '../Tags';
import icon from './Hiperdex.webp';
import { HiperManga } from './templates/HiperManga';

export default class extends HiperManga {

    public constructor() {
        super('hiperdex', 'Hiperdex', 'https://hiperdex.tv', Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Rating.Pornographic, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}
