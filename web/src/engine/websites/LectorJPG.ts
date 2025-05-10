import { Tags } from '../Tags';
import icon from './LectorJPG.webp';
import { Kosaku } from './templates/Kosaku';

export default class extends Kosaku {

    public constructor() {
        super('lectorjpg', 'LectorJPG', 'https://lectorjpg.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}