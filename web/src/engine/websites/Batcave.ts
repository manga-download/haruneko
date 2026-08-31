import { Tags } from '../Tags';
import icon from './Batcave.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<boolean>(`document.documentElement.innerHTML.indexOf('runModern()') > -1`);
    return result ? FetchRedirection.Automatic : undefined;
}, /https:\/\/batcave\.biz/);

@Common.MangaCSS(/^{origin}\/\d+-[^/]+\.html$/, 'div.page__title-row h1')
@Common.MangasMultiPageCSS('h2.readed__title a', Common.PatternLinkGenerator('/comix/page/{page}/'))
@Common.ChaptersSinglePageJS(`__DATA__.chapters.map(({ id, title}) =>  ({ id:'/reader/'+ __DATA__.news_id+ '/'+ id, title: title.replace(__DATA__.title, '').trim()}));`, 500)
@Common.PagesSinglePageJS('__DATA__.images', 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('batcave', 'Batcave', 'https://batcave.biz', Tags.Media.Comic, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), '', 10_000);
    }
}