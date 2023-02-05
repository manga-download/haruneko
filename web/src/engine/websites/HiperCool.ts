import { Tags } from '../Tags';
import icon from './HiperCool.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/https:\/\/hipercool\.xyz/, 'div.post-title')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2('div.chapter-name > a')
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hipercool', `Hiper Cool`, 'https://hipercool.xyz', Tags.Language.Portuguese, Tags.Rating.Erotica, Tags.Media.Manga, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }
}