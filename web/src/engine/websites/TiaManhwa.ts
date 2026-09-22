import { Tags } from '../Tags';
import icon from './TiaManhwa.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<boolean>(`document.documentElement.querySelector('form#lsrecaptcha-form') && true || false;`);
    return result ? FetchRedirection.Interactive : undefined;
}, /https:\/\/(?:www\.)?tiamanhwa\.com/);

@Madara.MangaCSS(/^{origin}\/manhwa\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tiamanhwa', 'TiaManhwa', 'https://tiamanhwa.com', Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}