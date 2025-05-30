import { Tags } from '../Tags';
import icon from './InariManga.webp';
import { Kosaku } from './templates/Kosaku';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^https:\/\/inarimanga\.[^/]+\.xyz\/series\/[^/]+\/$/, 'meta[property="og:title"]', (element) => (element as HTMLMetaElement).content.split('–').at(0).trim())
export default class extends Kosaku {

    public constructor() {
        super('inarimanga', 'InariManga', 'https://inarimanga.rzgold.xyz', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript(new Request(this.URI), `window.location.origin`, 1500);
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}