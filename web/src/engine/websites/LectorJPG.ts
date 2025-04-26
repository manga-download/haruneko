import { Tags } from '../Tags';
import icon from './LectorJPG.webp';
import { Kozaku } from './templates/Kozaku';

export default class extends Kozaku {

    public constructor() {
        super('lectorjpg', 'LectorJPG', 'https://lectorjpg.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}