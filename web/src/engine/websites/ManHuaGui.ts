import { Tags } from '../Tags';
import icon from './ManHuaGui.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SinMH from './decorators/SinMH';

/*
this.config = {
    throttle: {
        label: 'Page Throttle Requests [ms]',
        description: 'Enter the timespan in [ms] to delay consecuitive HTTP requests while downloading Pages.\nThe website may ban your IP for to many consecuitive requests.',
        input: 'numeric',
        min: 500,
        max: 10000,
        value: 2500
    }
};
*/

const queryPagesScript = `
            new Promise(resolve => {
                SMH.imgData = function(data) {
                    let origin = 'https://' + servs[pVars.curServ].hosts[pVars.curHost].h + '.hamreus.com';
                    let pageLinks = data.files.map(file => origin + data.path + file + '?cid=' + data.cid + '&md5=' + data.sl.md5);
                    return {
                        preInit: () => resolve(pageLinks)
                    };
                };
                let script = [...document.querySelectorAll('script:not([src])')].find(script => script.text.trim().startsWith('window[')).text;
                eval(script);
            } );
`;

@Common.MangaCSS(/^https?:\/\/(?:www\.)?(mhgui|manhuagui).com\/comic\/\d+\/$/, SinMH.queryManga)
@Common.MangasNotSupported()
@SinMH.ChaptersSinglePageJS(SinMH.queryChaptersScript, 'div.chapter-list ul li a')
@Common.PagesSinglePageJS(queryPagesScript)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuagui', `看漫画 (ManHuaGui)`, 'https://www.manhuagui.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}