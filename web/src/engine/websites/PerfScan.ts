import { Tags } from '../Tags';
import icon from './PerfScan.webp';
import { HeanCMS } from './templates/HeanCMS';

export default class extends HeanCMS {

    public constructor() {
        super('perfscan', 'Perf Scan', 'https://perf-scan.fr', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Novel, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}