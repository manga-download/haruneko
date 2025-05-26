import { Tags } from '../Tags';
import icon from './MaidScan.webp';
import { SussyBase } from './templates/SussyBase';

export default class extends SussyBase {

    public constructor() {
        super('maidscan', 'Maid Scan', 'https://novo.empreguetes.site', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Scanlator);
        this.scanId = '3';
    }

    public override get Icon() {
        return icon;
    }
}