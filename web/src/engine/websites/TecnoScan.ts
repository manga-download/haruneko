import { Tags } from '../Tags';
import icon from './TecnoScan.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https:\/\/(terc|tecn)o-(sun|moon)\.xyz\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('tecnoscan', 'Tecno Scan', 'https://tecno-moon.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), `window.location.origin`, 1500);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}