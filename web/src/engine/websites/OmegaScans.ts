import { Tags } from '../Tags';
import icon from './OmegaScans.webp';
import { HeanCMS } from './templates/HeanCMS';

export default class extends HeanCMS {

    public constructor() {
        super('omegascans', 'OmegaScans', 'https://omegascans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Novel, Tags.Language.English, Tags.Source.Scanlator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}