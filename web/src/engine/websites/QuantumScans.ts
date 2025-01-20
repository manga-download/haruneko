import { Tags } from '../Tags';
import icon from './QuantumScans.webp';
import { HeanCMS } from './templates/HeanCMS';

export default class extends HeanCMS {

    public constructor() {
        super('quantumscans', 'Quantum Scans', 'https://quantumscans.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
        this.mediaUrl = 'https://cdn.meowing.org';
    }

    public override get Icon() {
        return icon;
    }
}