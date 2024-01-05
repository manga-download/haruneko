import { Tags } from '../Tags';
import icon from './ManHuaGui.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SinMH from './decorators/SinMH';

const queryPagesScript = `
            new Promise(resolve => {
                SMH.imgData = function(data) {
                    let origin = pVars.manga.filePath;
                    let pageLinks = data.files.map(file => origin + file + '?e=' + data.sl.e + '&m=' + data.sl.m);
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
@Common.PagesSinglePageJS(queryPagesScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuagui', `看漫画 (ManHuaGui)`, 'https://www.manhuagui.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}