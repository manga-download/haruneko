import { Tags } from '../Tags';
import icon from './CatharsisWorld.webp';
import { Kosaku, PageScript } from './templates/Kosaku';
import * as Common from './decorators/Common';

@Common.PagesSinglePageJS(PageScript, 2500)
export default class extends Kosaku {

    public constructor() {
        super('catharsisworld', 'Catharsis World', 'https://catharsisworld.dig-it.info', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}