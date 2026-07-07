import { Tags } from '../Tags';
import icon from './MugiwarasOficial.webp';
import MangasBrasuka from './MangasBrasuka';

export default class extends MangasBrasuka {

    public constructor() {
        super('mugiwarasoficial', 'Mugiwaras Oficial', 'https://mugiwarasoficial.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }
}