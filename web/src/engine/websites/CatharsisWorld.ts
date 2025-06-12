import { Tags } from '../Tags';
import icon from './CatharsisWorld.webp';
import { Kosaku, PageScript } from './templates/Kosaku';
import * as Common from './decorators/Common';

@Common.PagesSinglePageJS(PageScript, 2500)
export default class extends Kosaku {

    public constructor() {
        super('catharsisworld', 'Catharsis World', 'https://catharsisworld.justep.me', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }
}