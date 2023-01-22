// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PlotTwistNoFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('plottwistnofansub', `Plot Twist No Fansub`, 'https://www.plot-twistnf-scans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PlotTwistNoFansub extends WordPressClarityMangaReader {

    constructor() {
        super();
        super.id = 'plottwistnofansub';
        super.label = 'Plot Twist No Fansub';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://www.plot-twistnf-scans.com';
        this.links = {
            login: 'https://www.plot-twistnf-scans.com/wp-login.php'
        };

        this.paths = [ '/proyectos-finalizados-new/', '/proyectos-activosss/' ];
        this.queryMangas = 'div.vc_gitem-zone a.vc_gitem-link';
    }
}
*/