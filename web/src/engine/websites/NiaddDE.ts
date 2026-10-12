import { Tags } from '../Tags';
import icon from './Niadd.webp';
import { NiaddBase } from './templates/NiaddBase';

export default class extends NiaddBase {
    public constructor() {
        super('ninemanga-de', 'Niadd (German)', 'https://de.niadd.com', Tags.Language.German, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}