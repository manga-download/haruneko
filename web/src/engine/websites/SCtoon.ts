import { Tags } from '../Tags';
import icon from './SCtoon.webp';
import { PeachScan } from './templates/PeachScan';

export default class extends PeachScan {

    public constructor() {
        super('sctoon', 'SCtoon', 'https://sctoon.net', Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

}