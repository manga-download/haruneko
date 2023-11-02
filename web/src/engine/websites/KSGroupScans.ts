import { Tags } from '../Tags';
import icon from './KSGroupScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/ksgroupscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ksgroupscans', `KSGroupScans`, 'https://ksgroupscans.com', Tags.Language.English, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}