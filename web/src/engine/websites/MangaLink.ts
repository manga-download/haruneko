import { Tags } from '../Tags';
import icon from './MangaLink.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

AddAntiScrapingDetection(async (dom) => {
    return dom.querySelector('form#lsrecaptcha-form[action*="/.lsrecap/recaptcha?"]') ? FetchRedirection.Interactive : undefined;
});

@Madara.MangaCSS(/^{origin}\/readcomics\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangalink', 'MangaLink', 'https://manga-link.org', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}