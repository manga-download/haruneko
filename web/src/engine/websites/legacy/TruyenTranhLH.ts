import { Tags } from '../../Tags';
import icon from './TruyenTranhLH.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import * as FlatManga from '../decorators/FlatManga';

@Common.MangaCSS(/^https?:\/\/truyentranhlh\.net\/truyen-tranh\/[^/]+$/, 'span.series-name')
@Common.MangasMultiPageCSS('/danh-sach?page={page}', FlatManga.queryMangas)
@FlatManga.ChaptersSinglePageCSS()
@Common.PagesSinglePageCSS(FlatManga.queryPages)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('truyentranhlh', `TruyentranhLH`, 'https://truyentranhlh.net', Tags.Language.Vietnamese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}