import { Tags } from '../Tags';
import icon from './CatharsisWorld.webp';
import { Kozaku } from './templates/Kozaku';

export default class extends Kozaku {

    public constructor() {
        super('catharsisworld', 'Catharsis World', 'https://lectorjpg.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}