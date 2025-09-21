import { Tags } from '../Tags';
import icon from './DangoScan.webp';
import { PeachScan } from './templates/PeachScan';

// TODO : no more peachscans
export default class extends PeachScan {

    public constructor() {
        super('dangoscan', 'Dango Scan', 'https://dangoscan.com.br', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}