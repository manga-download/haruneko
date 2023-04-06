// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './SDLGFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.sdlg-fansub\.tk\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sdlgfansub', 'SDLG Fansub', 'https://www.sdlg-fansub.tk'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SDLGFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'sdlgfansub';
        super.label = 'SDLG Fansub';
        this.tags = [ 'hentai', 'spanish' ];
        this.url = 'https://www.sdlg-fansub.tk';
    }
}
*/