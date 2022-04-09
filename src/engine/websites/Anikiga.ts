import { Tags } from '../Tags';
import icon from './Anikiga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import { ImageDirect } from './decorators/Common';

@Madara.MangaCSS()
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('anikiga', `Anikiga`, 'https://anikiga.com', Tags.Media.Manga, Tags.Language.Turkish);
    }

    public override get Icon() {
        return icon;
    }
}