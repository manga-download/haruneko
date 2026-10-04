import { Tags } from '../Tags';
import icon from './EZManga.webp';
import { EzMangaBase } from './templates/EzMangaBase';

export default class extends EzMangaBase {

    public constructor() {
        super('ezmanga', 'EZManga', 'https://ezmanga.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
        this.WithApiURL('https://vapi.ezmanga.org/api/v1/');
    }

    public override get Icon() {
        return icon;
    }
}