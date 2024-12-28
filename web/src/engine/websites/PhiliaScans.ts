import { Tags } from '../Tags';
import icon from './PhiliaScans.webp';
import { VTheme } from './templates/VTheme';

export default class extends VTheme {

    public constructor() {
        super('philiascans', 'Philia Scans', 'https://philiascans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator );
    }

    public override get Icon() {
        return icon;
    }
}
