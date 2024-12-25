import { Tags } from '../Tags';
import icon from './VortexScans.webp';
import { Iken } from './templates/Iken';

export default class extends Iken {

    public constructor() {
        super('vortexscans', 'Vortex Scans', 'https://vortexscans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator );
    }

    public override get Icon() {
        return icon;
    }
}
