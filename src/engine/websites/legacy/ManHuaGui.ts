// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManHuaGui.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuagui', `看漫画 (ManHuaGui)`, 'https://www.manhuagui.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManHuaGui extends SinMH {

    constructor() {
        super();
        super.id = 'manhuagui';
        super.label = '看漫画 (ManHuaGui)';
        this.tags = [ 'webtoon', 'chinese' ];
        this.url = 'https://www.manhuagui.com';
        this.requestOptions.headers.set('x-referer', this.url);

        this.api = 'SMH';
        //this.path = '/list/index_p%PAGE%.html';
        //this.queryMangasPageCount = 'div.pager a:last-of-type';
        this.queryChapters = 'div.chapter-list ul li a';
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
        this.queryPagesScript =`
            new Promise(resolve => {
                ${this.api}.imgData = function(data) {
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
    }

    async _getMangas() {
        let msg = 'This function was disabled to prevent of being IP banned by the website owner, please copy and paste the URL containing the chapters directly from your browser into HakuNeko.';
        throw new Error(msg);
    }
}
*/