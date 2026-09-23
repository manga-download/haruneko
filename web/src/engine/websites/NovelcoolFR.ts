import { Tags } from '../Tags';
import icon from './Novelcool.webp';
import { NiaddBase} from './templates/NiaddBase';

export default class extends NiaddBase {

    public constructor() {
        super('novelcool-fr', `Novel Cool (French)`, 'https://fr.novelcool.com', Tags.Language.French, Tags.Media.Manga, Tags.Media.Novel, Tags.Source.Aggregator);
        this.IsNovelWebsite();
    }

    public override get Icon() {
        return icon;
    }
}