import { Tags } from '../Tags';
import icon from './EternalMangas.webp';
import { VTheme } from './templates/VTheme';

export default class extends VTheme {

    public constructor() {
        super('eternalmangas', 'Eternal Mangas', 'https://eternalmangas.org', Tags.Media.Manhwa, Tags.Media.Novel, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}