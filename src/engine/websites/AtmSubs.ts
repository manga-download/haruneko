import { Tags } from '../Tags';
import icon from './AtmSubs.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/atm-subs\.fr\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
// TODO: Website no longer exist?
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('atmsubs', 'ATM Subs', 'https://atm-subs.fr', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French);
    }

    public override get Icon() {
        return icon;
    }
}