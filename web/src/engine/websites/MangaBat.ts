import { Tags } from '../Tags';
import icon from './MangaBat.webp';
import { MangaNel } from './templates/MangaNel';

export default class extends MangaNel {

    public constructor() {
        super('mangabat', `MangaBat`, 'https://www.mangabats.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
