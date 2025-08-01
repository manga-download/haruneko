import { Tags } from '../Tags';
import icon from './EternalMangas.webp';
import { VTheme } from './templates/VTheme';

export default class extends VTheme {

    public constructor() {
        super('eternalmangas', 'Eternal Mangas', 'https://eternalmangas.org', Tags.Media.Manhwa, Tags.Media.Novel, Tags.Language.Spanish, Tags.Source.Aggregator);
        this.apiUrl = new URL('https://api.eternalmangas.org/api/');
    }

    public override get Icon() {
        return icon;
    }
}