// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

import { Tags } from '../../Tags';
import icon from './MintManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import { FetchWindowScript } from '../../platform/FetchProvider';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mintmanga', `MintManga`, 'https://mintmanga.live', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Russian, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}

// Original Source
/*
class MintManga extends ReadManga {

    constructor() {
        super();
        super.id = 'mintmanga';
        super.label = 'MintManga';
        this.tags = [ 'manga', 'webtoon', 'russian' ];
        this.url = 'https://mintmanga.live';

        this.preferSubtitleAsMangaTitle = true;
    }
}
*/