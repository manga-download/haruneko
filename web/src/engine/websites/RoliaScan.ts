import { Tags } from '../Tags';
import icon from './RoliaScan.webp';
import { MangaPeakBase } from './templates/MangaPeakBase';

export default class extends MangaPeakBase {

    public constructor() {
        super('roliascan', 'Rolia Scan', 'https://roliascan.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}