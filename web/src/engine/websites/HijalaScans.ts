import { Tags } from '../Tags';
import icon from './HijalaScans.webp';
import { VTheme } from './templates/VTheme';
import * as Common from './decorators/Common';

@Common.PagesSinglePageCSS('section[itemprop="articleBody"] figure img:not([itemprop])')
export default class extends VTheme {

    public constructor() {
        super('hijalascans', 'Hijala Scans', 'https://en-hijala.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}