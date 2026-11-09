import { Tags } from '../Tags';
import icon from './Novelcool.webp';
import { NiaddBase} from './templates/NiaddBase';

export default class extends NiaddBase {

    public constructor() {
        super('novelcool-ru', `Novel Cool (Russian)`, 'https://ru.novelcool.com', Tags.Language.Russian, Tags.Media.Manga, Tags.Media.Novel, Tags.Source.Aggregator);
        this.IsNovelWebsite();
    }

    public override get Icon() {
        return icon;
    }
}