// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './DarkSkyProjects.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/darkskyprojects\.org\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('darkskyprojects', 'DarkSky Projects', 'https://darkskyprojects.org'/*, Tags.Media., Tags.Language.*/);
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