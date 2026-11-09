import { Tags } from '../Tags';
import icon from './MangaTaro.webp';
import { MangaPeakBase } from './templates/MangaPeakBase';

export default class extends MangaPeakBase {

    public constructor() {
        super('mangataro', 'MangaTaro', 'https://mangataro.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}