import { Tags } from '../Tags';
import icon from './HentaiLib.webp';
import { LibGroup } from './templates/LibGroup';

export default class extends LibGroup {

    public constructor() {
        super('hentailib', 'HentaiLib', 'https://hentailib.me', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Russian, Tags.Source.Aggregator, Tags.Rating.Pornographic);
        this.WithSiteID(4).SetAPI('https://hapi.hentaicdn.org/api/');
    }

    public override get Icon() {
        return icon;
    }
}