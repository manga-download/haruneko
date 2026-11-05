import { Tags } from '../Tags';
import icon from './HiveScans.webp';
import { VTheme } from './templates/VTheme';
import * as Common from './decorators/Common';

@Common.PagesSinglePageCSS('section[itemprop="articleBody"] figure img:not([itemprop])')
export default class extends VTheme {

    public constructor() {
        super('hivescans', 'Hive Scans', 'https://hivetoons.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}