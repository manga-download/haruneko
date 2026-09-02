import { Tags } from '../Tags';
import icon from './AstreaScans.webp';
import { HolyScanBase } from './templates/HolyScanBase';

export default class extends HolyScanBase {

    public constructor() {
        super('astreascans', 'Astrea Scans', 'https://astreascans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
        this.WithPrefix('astrea');
    }

    public override get Icon() {
        return icon;
    }
}