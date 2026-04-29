import { Tags } from '../Tags';
import icon from './CosmicScansIndonesia.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

@MangaStream.MangaCSS(/^https:\/\/lc\d+\.cosmicscans\.asia\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS([ /800X250\.webp$/, /\.gif$/ ], 'ts_reader.params.sources.shift().images;')
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cosmicscansid', 'Cosmic Scans Indonesia', 'https://lc7.cosmicscans.asia', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Scanlator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), 'window.location.origin');
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}