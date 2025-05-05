import { Tags } from '../Tags';
import icon from './CatharsisWorld.webp';
import { Kosaku } from './templates/Kosaku';

export default class extends Kosaku {

    public constructor() {
        super('catharsisworld', 'Catharsis World', 'https://catharsisworld.dig-it.info', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}