// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TuMangaNet.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/tumanga\.net\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tumanganet', 'Tu Manga Online', 'https://tumanga.net'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TuMangaNet extends WordPressMadara {

    constructor() {
        super();
        super.id = 'tumanganet';
        super.label = 'Tu Manga Online';
        this.tags = [ 'manga', 'webtoon', 'spanish' ];
        this.url = 'https://tumanga.net';
    }

    // NOTE: Initialize website without parameters, otherwise the request will time out
    async _initializeConnector() {
        let uri = new URL(this.url);
        let request = new Request(uri, this.requestOptions);
        return Engine.Request.fetchUI(request, '');
    }
}
*/