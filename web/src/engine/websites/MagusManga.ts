import { Tags } from '../Tags';
import icon from './MagusManga.webp';
import * as Common from './decorators/Common';
import { VTheme, pageScript } from './templates/VTheme';

@Common.PagesSinglePageJS(pageScript, 750, true)
export default class extends VTheme {

    public constructor() {
        super('magusmanga', 'MagusManga', 'https://magustoon.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}