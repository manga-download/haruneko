import { Tags } from '../Tags';
import icon from './Toonilyme.webp';
import { MadTheme } from './templates/MadTheme';
import * as Common from './decorators/Common';

@Common.MangasMultiPageCSS('/az-list?page={page}', 'div.list div.title h3 a')
@Common.PagesSinglePageCSS('div#chapter-images div.chapter-image img[data-src]')
export default class extends MadTheme {

    public constructor() {
        super('toonilyme', 'Toonily (.me)', 'https://toonily.me', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}