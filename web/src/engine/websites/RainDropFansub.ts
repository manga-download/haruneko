import { Tags } from '../Tags';
import icon from './RainDropFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<boolean>(`document.documentElement.querySelector('form#lsrecaptcha-form') && true || false;`);
    return result ? FetchRedirection.Interactive : undefined;
}, /https:\/\/(?:www\.)?raindropteamfan\.com/);

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('raindropfansub', 'Rain Drop Fansub', 'https://www.raindropteamfan.com', Tags.Language.Turkish, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }
}