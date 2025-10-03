import { Tags } from '../Tags';
import icon from './CatharsisWorld.webp';
import { Kosaku } from './templates/Kosaku';
import * as Common from './decorators/Common';
import { WPMangaProtectorPagesExtractorScript } from './decorators/WordPressMadara';

@Common.PagesSinglePageJS(WPMangaProtectorPagesExtractorScript, 2000)
export default class extends Kosaku {

    public constructor() {
        super('catharsisworld', 'Catharsis World', 'https://catharsisworld.dig-it.info', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }
}