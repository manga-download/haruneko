import { Tags } from '../Tags';
import icon from './ReaperScans.webp';
import { HeanCMS } from './templates/HeanCMS';
export default class extends HeanCMS {

    public constructor() {
        super('reaperscans', 'Reaper Scans', 'https://reaperscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
        this.mediaUrl = 'https://media.reaperscans.com/file/4SRBHm';
    }

    public override get Icon() {
        return icon;
    }
}
