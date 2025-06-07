import { Tags } from '../Tags';
import icon from './MangaReaderSite.webp';
import { MangaHubBase } from './templates/MangaHubBase';

export default class extends MangaHubBase {

    public constructor() {
        super('mangareadersite', `MangaReaderSite`, 'https://mangareader.site', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
        this.path = 'mr01';
    }

    public override get Icon() {
        return icon;
    }
}