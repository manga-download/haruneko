import { Tags } from '../Tags';
import icon from './MagusManga.webp';
import { VTheme } from './templates/VTheme';
import * as Common from './decorators/Common';

@Common.PagesSinglePageCSS('section[itemprop="articleBody"] figure img:not([itemprop])')
export default class extends VTheme {

    public constructor() {
        super('magusmanga', 'MagusManga', 'https://magustoon.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}