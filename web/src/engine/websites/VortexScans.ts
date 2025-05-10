import { Tags } from '../Tags';
import icon from './VortexScans.webp';
import { VTheme } from './templates/VTheme';

export default class extends VTheme {

    public constructor() {
        super('vortexscans', 'Vortex Scans', 'https://vortexscans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
        this.apiUrl = new URL('https://api.vortexscans.org/api/');
    }

    public override get Icon() {
        return icon;
    }
}