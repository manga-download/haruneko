import { Tags } from '../Tags';
import icon from './Novelcool.webp';
import { NiaddBase} from './templates/NiaddBase';

export default class extends NiaddBase {

    public constructor() {
        super('novelcool-br', `Novel Cool (Portuguese)`, 'https://br.novelcool.com', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Media.Novel, Tags.Source.Aggregator);
        this.IsNovelWebsite();
    }

    public override get Icon() {
        return icon;
    }
}