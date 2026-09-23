import { Tags } from '../Tags';
import icon from './Niadd.webp';
import { NiaddBase } from './templates/NiaddBase';

export default class extends NiaddBase {
    public constructor() {
        super('ninemanga-it', 'Niadd (Italian)', 'https://it.niadd.com', Tags.Language.Italian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}