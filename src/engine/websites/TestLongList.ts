import { Tags } from '../Tags';
import { FetchJSON, FetchRequest } from '../FetchProvider';
import { MangaPlugin, Manga, DecoratableMangaScraper } from '../providers/MangaPlugin';

/**
 * Sample Website Implementation for Developer Testing
 */
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('test-long-list', `Test - Long List`, 'https://hakuneko.download/sample-websites/long-title-list/', Tags.Media.Comic, Tags.Source.Official, Tags.Rating.Safe, Tags.Language.Multilingual);
    }

    public override get Icon() {
        return 'https://hakuneko.download/favicon.ico';
    }

    public async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new FetchRequest(this.URI + '/mangadex.json');
        const data = await FetchJSON<{ id: string; title: string; }[]>(request);
        return data.map(entry => new Manga(this, provider, entry.id, entry.title));
    }
}