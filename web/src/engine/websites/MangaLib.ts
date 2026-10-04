import { Tags } from '../Tags';
import icon from './MangaLib.webp';
import { LibGroup } from './templates/LibGroup';

export default class extends LibGroup {

    public constructor() {
        super('mangalib', 'MangaLib', 'https://mangalib.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Russian, Tags.Source.Aggregator);
        this.WithSiteID(1).SetAPI('https://api.cdnlibs.org/api/');
    }

    public override get Icon() {
        return icon;
    }
}