// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ImperioDosOtakus.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('imperiodosotakus', `Imperio dos Otakus`, 'https://imperiodosotakus.tk' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ImperioDosOtakus extends WordPressMadara {

    constructor() {
        super();
        super.id = 'imperiodosotakus';
        super.label = 'Imperio dos Otakus';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://imperiodosotakus.tk';
    }
}
*/