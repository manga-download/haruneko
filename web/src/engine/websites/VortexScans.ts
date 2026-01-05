import { Tags } from '../Tags';
import icon from './VortexScans.webp';
import * as Common from './decorators/Common';
import { VTheme, pageScript } from './templates/VTheme';

@Common.PagesSinglePageJS(pageScript, 750, true)
export default class extends VTheme {

    public constructor() {
        super('vortexscans', 'Vortex Scans', 'https://vortexscans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}