import { Tags } from '../Tags';
import icon from './InariManga.webp';
import { Kosaku } from './templates/Kosaku';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'meta[property="og:title"]', (element) => (element as HTMLMetaElement).content.split('–').at(0).trim())
export default class extends Kosaku {

    public constructor() {
        super('inarimanga', 'InariManga', 'https://inarimanga.yoapps.xyz', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}