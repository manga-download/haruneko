import { Tags } from '../Tags';
import icon from './NyxScans.webp';
import { VTheme } from './templates/VTheme';

export default class extends VTheme {

    public constructor() {
        super('nyxscans', 'Nyx Scans', 'https://nyxscans.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
        this.apiUrl = new URL('https://api.nyxscans.com/api/');
    }

    public override get Icon() {
        return icon;
    }
}