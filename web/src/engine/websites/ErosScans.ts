import { Tags } from '../Tags';
import icon from './ErosScans.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

// NOTE: This is a temporary workaround to assign the correct origin, because those fools forgot to update the image links after their top-level domain rotation
const workaroundPageScript = `ts_reader_control.getImages().map(link => new URL(new URL(link).pathname, window.location.origin).href);`;

@MangaStream.MangaCSS(/^https:\/\/eros-(sun|moon)\.xyz\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS('div#chapterlist ul li div.chbox:not(:has(.dt)) div.eph-num a') //Exclude chapters on TecnoScans
@MangaStream.PagesSinglePageJS([], workaroundPageScript)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('erosscans', 'Eros Scans', 'https://eros-moon.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), `window.location.origin`, 1500);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}