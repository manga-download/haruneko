import { Tags } from '../Tags';
import icon from './Hiperdex.webp';
import LerHentais from './LerHentais';

export default class extends LerHentais {

    public constructor() {
        super('hiperdex', 'Hiperdex', 'https://hiperdex.tv', Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Rating.Pornographic, Tags.Language.English);
    }
    public override get Icon() {
        return icon;
    }
}
