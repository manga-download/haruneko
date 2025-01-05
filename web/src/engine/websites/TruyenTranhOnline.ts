import { Tags } from '../Tags';
import icon from './TruyenTranhOnline.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MojoPortalComic from './templates/MojoPortalComic';
import * as Common from './decorators/Common';

const primaryDomain = 'truyentutien.site';
const patternAliasDomains = [
    primaryDomain,
    'truyentutien.fun',
    'truyentutien.xyz',
    'tutientruyen\\d+.fun',
    'tutientruyen\\d+.xyz',
    'protruyen\\d+.xyz',
].join('|').replaceAll('.', '\\.');

@Common.MangaCSS(new RegExp(`^https?://(${patternAliasDomains})/[^/]+$`), MojoPortalComic.queryManga)
@Common.MangasMultiPageCSS(MojoPortalComic.patternMangas, MojoPortalComic.queryMangas)
@Common.ChaptersSinglePageCSS(MojoPortalComic.queryChapters)
@Common.PagesSinglePageCSS('div.page-chapter img:not([src$="/123.jpg"]):not([src$="/ttt5xyz.jpg"])')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('truyentranhaudioonline', 'Truyện Audio', `https://${primaryDomain}`, Tags.Media.Manhwa, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}