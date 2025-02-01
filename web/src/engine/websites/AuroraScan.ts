import { Tags } from '../Tags';
import icon from './AuroraScan.webp';
import { PeachScan } from './templates/PeachScan';

export default class extends PeachScan {

    public constructor() {
        super('aurorascan', 'Aurora Scan', 'https://aurorascan.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}