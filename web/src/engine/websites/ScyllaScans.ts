import { Tags } from '../Tags';
import icon from './ScyllaScans.webp';
import { FuzzyDoodle } from './templates/FuzzyDoodle';

export default class extends FuzzyDoodle {

    public constructor() {
        super('scyllascans', `Scylla Scans`, 'https://scyllacomics.xyz', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}