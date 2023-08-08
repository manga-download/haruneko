import { Tags } from '../Tags';
import icon from './RealmScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('div.tt').textContent.trim();
    return {id, title};
}

@MangaStream.MangaCSS(/^https?:\/\/realmscans\.xyz\/\S+\/series\/[^/]+$/)
@Common.MangasSinglePageCSS('/series', 'div.bsx a', MangaExtractor)
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('realmscans', 'RealmScans', 'https://realmscans.xyz', Tags.Media.Manga, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}