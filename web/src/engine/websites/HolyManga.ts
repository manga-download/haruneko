import { Tags } from '../Tags';
import icon from './HolyManga.webp';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import { FlatManga, MangaLabelExtractor, queryMangaTitle } from './templates/FlatManga';

@Common.MangaCSS(/^https:\/\/w\d+\.holymanga\.net\/[^/]+\.html$/, queryMangaTitle, MangaLabelExtractor)

export default class extends FlatManga {

    public constructor() {
        super('holymanga', 'Holy Manga', 'https://w34.holymanga.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}