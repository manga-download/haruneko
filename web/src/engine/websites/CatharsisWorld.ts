import { Tags } from '../Tags';
import icon from './CatharsisWorld.webp';
import { Kosaku } from './templates/Kosaku';

export default class extends Kosaku {

    public constructor() {
        super('catharsisworld', 'Catharsis World', 'https://catharsisworld.akan01.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }
}