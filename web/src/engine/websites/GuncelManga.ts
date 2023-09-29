import { Tags } from '../Tags';
import icon from './GuncelManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/guncelmanga\.net\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Güncel Manga"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('guncelmanga', 'Güncel Manga', 'https://guncelmanga.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish);
    }

    public override get Icon() {
        return icon;
    }
}