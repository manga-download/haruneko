import { Tags } from '../Tags';
import icon from './LELScanVF.webp';
import { FuzzyDoodle } from './templates/FuzzyDoodle';

export default class extends FuzzyDoodle {

    public constructor() {
        super('lelscanvf', `LELSCAN-VF`, 'https://lelscanfr.com', Tags.Language.French, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}