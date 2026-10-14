import { Tags } from '../Tags';
import icon from './KomikRealm.webp';
import { QwikMangas } from './templates/QwikMangas';
export default class extends QwikMangas {

    public constructor() {
        super('komikrealm', 'KomikRealm', 'https://komikrealm.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}