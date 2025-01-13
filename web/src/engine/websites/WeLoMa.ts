import { Tags } from '../Tags';
import icon from './WeLoMa.webp';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import { FlatManga, MangaLabelExtractor, queryMangaTitle } from './templates/FlatManga';

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, queryMangaTitle, MangaLabelExtractor)
export default class extends FlatManga {
    public constructor() {
        super('weloma', `WeLoMa`, 'https://weloma.art', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return await FetchWindowScript(new Request(new URL('/manga-list.html', this.URI)), 'true', 3000, 15000);//trigger antiDDOSS
    }
}