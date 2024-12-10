import { Tags } from '../Tags';
import icon from './TruyenTranhOnline.webp';
import * as Common from './decorators/Common';
import { MojoPortalComic, queryMangaTitle } from './templates/MojoPortalComic';

@Common.MangaCSS(/^{origin}\/truyen-[^.]+\.html$/, queryMangaTitle)

export default class extends MojoPortalComic {

    public constructor() {
        // TODO: Is tutientruyen5.xyz the correct new domain?
        super('truyentranhaudioonline', 'Truyện tranh online', 'https://protruyen4.xyz', Tags.Media.Manhwa, Tags.Language.Vietnamese, Tags.Source.Aggregator);
        this.pagesExcludePatterns = [/pro5xyz\.jpg$/, /\/123.jpg$/];
        this.queryPages = 'div.reading-detail img';
    }

    public override get Icon() {
        return icon;
    }
}