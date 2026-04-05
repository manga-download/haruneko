import { Tags } from '../Tags';
import icon from './VortexScans.webp';
import { VTheme } from './templates/VTheme';
import * as Common from './decorators/Common';

@Common.PagesSinglePageCSS('section[itemprop="articleBody"] figure img:not([itemprop])')
export default class extends VTheme {

    public constructor() {
        super('vortexscans', 'Vortex Scans', 'https://vortexscans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}