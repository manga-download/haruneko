import { Tags } from '../Tags';
import icon from './VoidScans.webp';
import VortexScans from './VortexScans';

export default class extends VortexScans {

    public constructor() {
        super('voidscans', 'Hive Scans', 'https://hivetoon.com', [Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator]);
    }

    public override get Icon() {
        return icon;
    }
}