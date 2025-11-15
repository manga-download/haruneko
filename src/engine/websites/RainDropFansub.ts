import { Tags } from '../Tags';
import icon from './RainDropFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';

@MangaStream.MangaCSS(/^https?:\/\/www\.raindropteamfan\.com\/manga\//)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('raindropfansub', `Rain Drop Fansub`, 'https://www.raindropteamfan.com', Tags.Language.Turkish, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }
}