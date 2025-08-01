import { Tags } from '../Tags';
import icon from './MangaHub.webp';
import { MangaHubBase } from './templates/MangaHubBase';

export default class extends MangaHubBase {

    public constructor () {
        super('mangahub', 'MangaHub', 'https://mangahub.io', 'm01', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}