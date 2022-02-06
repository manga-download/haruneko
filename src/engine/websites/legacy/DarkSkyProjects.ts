// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './DarkSkyProjects.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('darkskyprojects', `DarkSky Projects`, 'https://darkskyprojects.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DarkSkyProjects extends WordPressMadara {

    constructor() {
        super();
        super.id = 'darkskyprojects';
        super.label = 'DarkSky Projects';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'https://darkskyprojects.org';
    }
}
*/