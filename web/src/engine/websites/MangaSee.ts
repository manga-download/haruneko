import { Tags } from '../Tags';
import icon from './MangaSee.webp';
import MangaLife from './MangaLife';

export default class extends MangaLife {
    public constructor() {
        super('mangasee', `MangaSee`, 'https://mangasee123.com', [Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator]);
    }
    public override get Icon() {
        return icon;
    }
}